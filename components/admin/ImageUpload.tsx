'use client'

import { useRef, useState, useTransition } from 'react'
import { Upload, Loader2, X, ImageIcon } from 'lucide-react'
import { uploadImage } from '@/lib/actions'
import { toast } from 'sonner'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder: string
  label?: string
}

const MAX_DIMENSION = 1200 // Max width or height in pixels
const QUALITY = 0.82 // JPEG/WebP compression quality

/**
 * Compress image on the client before uploading.
 * Resizes to max 1200px and compresses to ~80% quality WebP.
 * This reduces a typical 3-5MB photo to ~100-300KB.
 */
function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    // Skip compression for GIFs (would lose animation) or already small files
    if (file.type === 'image/gif' || file.size < 100 * 1024) {
      resolve(file)
      return
    }

    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img

      // Scale down if larger than MAX_DIMENSION
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width)
          width = MAX_DIMENSION
        } else {
          width = Math.round((width * MAX_DIMENSION) / height)
          height = MAX_DIMENSION
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file) // Fallback to original
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // Convert to WebP for best compression (fallback to JPEG)
      const outputType = 'image/webp'
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file)
            return
          }

          // Create a new File with .webp extension
          const compressedName = file.name.replace(/\.[^.]+$/, '.webp')
          const compressed = new File([blob], compressedName, {
            type: outputType,
            lastModified: Date.now(),
          })

          resolve(compressed)
        },
        outputType,
        QUALITY
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image for compression'))
    }

    img.src = url
  })
}

export function ImageUpload({ value, onChange, folder, label = 'Upload Image' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState(value)
  const [status, setStatus] = useState('')

  const handleFile = (file: File) => {
    startTransition(async () => {
      try {
        // Step 1: Compress on client
        setStatus('Compressing...')
        const compressed = await compressImage(file)

        // Step 2: Upload to server
        setStatus('Uploading...')
        const formData = new FormData()
        formData.append('file', compressed)
        const { url } = await uploadImage(formData, folder)

        setPreview(url)
        onChange(url)
        setStatus('')
        toast.success('Image uploaded')
      } catch (e) {
        setStatus('')
        toast.error(e instanceof Error ? e.message : 'Upload failed')
      }
    })
  }

  return (
    <div>
      <label className="block font-mono text-[11px] text-slate-500 tracking-widest uppercase mb-2">{label}</label>
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center flex-shrink-0">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={28} className="text-slate-300" />
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-sm font-medium hover:bg-sky-100 transition-colors disabled:opacity-60"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {isPending ? (status || 'Processing...') : 'Choose File'}
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => { setPreview(''); onChange('') }}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
            >
              <X size={12} /> Remove image
            </button>
          )}
          <p className="text-[10px] text-slate-400">JPG, PNG, WebP, GIF — max 5MB. Auto-compressed before upload.</p>
        </div>
      </div>
    </div>
  )
}
