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

export function ImageUpload({ value, onChange, folder, label = 'Upload Image' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState(value)

  const handleFile = (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    startTransition(async () => {
      try {
        const { url } = await uploadImage(formData, folder)
        setPreview(url)
        onChange(url)
        toast.success('Image uploaded')
      } catch (e) {
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
            {isPending ? 'Uploading...' : 'Choose File'}
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
          <p className="text-[10px] text-slate-400">JPG, PNG, WebP, GIF — max 5MB. Stored in database storage.</p>
        </div>
      </div>
    </div>
  )
}
