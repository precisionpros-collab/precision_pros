'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { usePerformanceMode } from '@/hooks/usePerformanceMode'

// Dynamic texture generator for soft glowing circular nodes
function createCircleTexture(color: string, size = 64) {
  if (typeof window === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.2, color)
    gradient.addColorStop(0.5, color.replace('1)', '0.3)'))
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  return new THREE.CanvasTexture(canvas)
}

// Dynamic texture generator for glowing holographic binary digits
function createBinaryTexture(text: string, color: string, size = 128) {
  if (typeof window === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'
    ctx.fillRect(0, 0, size, size)
    ctx.font = 'bold 80px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // Add text glow
    ctx.shadowColor = color
    ctx.shadowBlur = 25
    ctx.fillStyle = color
    ctx.fillText(text, size / 2, size / 2)
  }
  return new THREE.CanvasTexture(canvas)
}

interface NodePoint {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  baseX: number
  baseY: number
  baseZ: number
}

interface FloatingDigit {
  sprite: THREE.Sprite
  vx: number
  vy: number
  vz: number
  rotSpeed: number
}

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const { liteMode, isMobile } = usePerformanceMode()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Screen-specific settings
    const NODE_COUNT = isMobile ? 45 : liteMode ? 55 : 85
    const MAX_LINE_DIST = isMobile ? 120 : 160
    const BINARY_COUNT = isMobile ? 20 : liteMode ? 25 : 40
    const SPEED_SCALE = isMobile ? 0.35 : 0.5

    // Colors matching theme
    const colorGold = 'rgba(227, 200, 168, 1)'       // #e3c8a8
    const colorTeal = 'rgba(93, 193, 164, 1)'       // #5dc1a4

    // 1. Setup Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene()
    
    // Ambient fog for deep space feel
    scene.fog = new THREE.FogExp2(0x030504, 0.0015)

    let width = container.clientWidth
    let height = container.clientHeight
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000)
    camera.position.z = 600

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // 2. Generate Textures Dynamically
    const goldNodeTex = createCircleTexture(colorGold)
    const tealNodeTex = createCircleTexture(colorTeal)
    const zeroTex = createBinaryTexture('0', colorTeal)
    const oneTex = createBinaryTexture('1', colorGold)

    // Fallbacks if textures fail to create
    if (!goldNodeTex || !tealNodeTex || !zeroTex || !oneTex) return

    // 3. Create Neural network nodes data structures
    const nodes: NodePoint[] = []
    const positions = new Float32Array(NODE_COUNT * 3)
    const colors = new Float32Array(NODE_COUNT * 3)

    // Spawn nodes in a 3D box
    const boxW = isMobile ? 500 : 900
    const boxH = isMobile ? 600 : 700
    const boxD = 400

    for (let i = 0; i < NODE_COUNT; i++) {
      const x = (Math.random() - 0.5) * boxW
      const y = (Math.random() - 0.5) * boxH
      const z = (Math.random() - 0.5) * boxD

      nodes.push({
        x, y, z,
        vx: (Math.random() - 0.5) * SPEED_SCALE,
        vy: (Math.random() - 0.5) * SPEED_SCALE,
        vz: (Math.random() - 0.5) * SPEED_SCALE,
        baseX: x, baseY: y, baseZ: z
      })

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Stagger colors (Gold vs Teal)
      const isGold = Math.random() > 0.45
      colors[i * 3] = isGold ? 227 / 255 : 93 / 255
      colors[i * 3 + 1] = isGold ? 200 / 255 : 193 / 255
      colors[i * 3 + 2] = isGold ? 168 / 255 : 164 / 255
    }

    // Node geometry & points material
    const nodeGeometry = new THREE.BufferGeometry()
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    nodeGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Use gold texture as primary node representation
    const nodeMaterial = new THREE.PointsMaterial({
      size: isMobile ? 14 : 18,
      map: goldNodeTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial)
    scene.add(nodePoints)

    // 4. Create Neural Connections (Lines)
    // Pre-allocate buffer arrays for lines to maximize render efficiency
    const maxLines = NODE_COUNT * 6
    const linePositions = new Float32Array(maxLines * 2 * 3)
    const lineColors = new Float32Array(maxLines * 2 * 3)

    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      linewidth: 1, // Note: linewidth > 1 usually not supported by WebGL implementations
      depthWrite: false
    })

    const connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(connectionLines)

    // 5. Create Holographic Binary Data Streams
    const digits: FloatingDigit[] = []
    const digitGroup = new THREE.Group()
    scene.add(digitGroup)

    const zeroMat = new THREE.SpriteMaterial({
      map: zeroTex,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const oneMat = new THREE.SpriteMaterial({
      map: oneTex,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    for (let i = 0; i < BINARY_COUNT; i++) {
      const isOne = Math.random() > 0.5
      const mat = isOne ? oneMat.clone() : zeroMat.clone()
      const sprite = new THREE.Sprite(mat)
      
      const scale = 14 + Math.random() * 20
      sprite.scale.set(scale, scale, 1)

      const x = (Math.random() - 0.5) * boxW
      const y = (Math.random() - 0.5) * boxH
      const z = (Math.random() - 0.5) * boxD

      sprite.position.set(x, y, z)
      digitGroup.add(sprite)

      digits.push({
        sprite,
        vx: (Math.random() - 0.5) * SPEED_SCALE * 0.7,
        vy: (0.2 + Math.random() * 0.5) * SPEED_SCALE, // drift upwards slightly
        vz: (Math.random() - 0.5) * SPEED_SCALE * 0.7,
        rotSpeed: (Math.random() - 0.5) * 0.01
      })
    }

    // 6. Interactive Event Listeners
    const handleMouseMove = (e: MouseEvent) => {
      // Map screen coordinates to -350 to +350 range in WebGL space
      mouseRef.current.targetX = ((e.clientX / window.innerWidth) - 0.5) * 600
      mouseRef.current.targetY = -((e.clientY / window.innerHeight) - 0.5) * 450
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = ((e.touches[0].clientX / window.innerWidth) - 0.5) * 500
        mouseRef.current.targetY = -((e.touches[0].clientY / window.innerHeight) - 0.5) * 350
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    // 7. Render Loop with Viewport Visibility Gating
    let animationFrameId = 0
    let isVisible = true

    // Only render when component is in view to save GPU cycles
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    // Gentle global rotation
    let rotX = 0
    let rotY = 0

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      if (!isVisible) return

      // Smooth mouse interpolation (easing)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05

      // Gentle continuous rotation of scene
      rotX += 0.0006
      rotY += 0.0008
      nodePoints.rotation.x = rotX
      nodePoints.rotation.y = rotY
      connectionLines.rotation.x = rotX
      connectionLines.rotation.y = rotY
      digitGroup.rotation.y = rotY * 0.5

      // Get pointer positions
      const nodePosAttr = nodeGeometry.getAttribute('position') as THREE.BufferAttribute
      const positionsArray = nodePosAttr.array as Float32Array

      // Update node positions
      for (let i = 0; i < NODE_COUNT; i++) {
        const node = nodes[i]

        // 1. Move by velocity
        node.x += node.vx
        node.y += node.vy
        node.z += node.vz

        // 2. Bounce inside bounds
        const xLimit = boxW / 2
        const yLimit = boxH / 2
        const zLimit = boxD / 2

        if (Math.abs(node.x) > xLimit) node.vx *= -1
        if (Math.abs(node.y) > yLimit) node.vy *= -1
        if (Math.abs(node.z) > zLimit) node.vz *= -1

        // 3. Mouse gravity effect (Pull nodes close to cursor, push others)
        // Convert mouse coordinates into the rotated local coordinates of the node points
        const cosY = Math.cos(-rotY)
        const sinY = Math.sin(-rotY)
        const localMouseX = mouseRef.current.x * cosY
        const localMouseZ = -mouseRef.current.x * sinY
        const localMouseY = mouseRef.current.y

        const dx = node.x - localMouseX
        const dy = node.y - localMouseY
        const dz = node.z - localMouseZ
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        // Inside gravity radius (220 units)
        if (dist < 220) {
          const force = (1 - dist / 220) * 0.35
          // Pull slightly toward the cursor
          node.x -= dx * force * 0.1
          node.y -= dy * force * 0.1
          node.z -= dz * force * 0.1
        }

        // Apply back to buffer array
        positionsArray[i * 3] = node.x
        positionsArray[i * 3 + 1] = node.y
        positionsArray[i * 3 + 2] = node.z
      }
      nodePosAttr.needsUpdate = true

      // Update lines segments
      let lineIndex = 0
      const linePosAttr = lineGeometry.getAttribute('position') as THREE.BufferAttribute
      const linePosArray = linePosAttr.array as Float32Array
      const lineColAttr = lineGeometry.getAttribute('color') as THREE.BufferAttribute
      const lineColArray = lineColAttr.array as Float32Array

      for (let i = 0; i < NODE_COUNT; i++) {
        const nodeA = nodes[i]

        for (let j = i + 1; j < NODE_COUNT; j++) {
          if (lineIndex >= maxLines) break

          const nodeB = nodes[j]
          const dx = nodeA.x - nodeB.x
          const dy = nodeA.y - nodeB.y
          const dz = nodeA.z - nodeB.z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < MAX_LINE_DIST) {
            // Draw active connection line segment
            const idx = lineIndex * 6

            linePosArray[idx] = nodeA.x
            linePosArray[idx + 1] = nodeA.y
            linePosArray[idx + 2] = nodeA.z

            linePosArray[idx + 3] = nodeB.x
            linePosArray[idx + 4] = nodeB.y
            linePosArray[idx + 5] = nodeB.z

            // Calculate gradient colors
            const alpha = 1.0 - dist / MAX_LINE_DIST

            // Mix line color based on nodes colors
            const rA = colors[i * 3]
            const gA = colors[i * 3 + 1]
            const bA = colors[i * 3 + 2]

            const rB = colors[j * 3]
            const gB = colors[j * 3 + 1]
            const bB = colors[j * 3 + 2]

            // Apply colors and fading opacity based on distance
            lineColArray[idx] = rA * alpha * 0.5
            lineColArray[idx + 1] = gA * alpha * 0.5
            lineColArray[idx + 2] = bA * alpha * 0.5

            lineColArray[idx + 3] = rB * alpha * 0.5
            lineColArray[idx + 4] = gB * alpha * 0.5
            lineColArray[idx + 5] = bB * alpha * 0.5

            lineIndex++
          }
        }
      }

      // Zero out remaining unused line segments
      for (let i = lineIndex; i < maxLines; i++) {
        const idx = i * 6
        linePosArray[idx] = 0
        linePosArray[idx + 1] = 0
        linePosArray[idx + 2] = 0
        linePosArray[idx + 3] = 0
        linePosArray[idx + 4] = 0
        linePosArray[idx + 5] = 0
        
        lineColArray[idx] = 0
        lineColArray[idx + 1] = 0
        lineColArray[idx + 2] = 0
        lineColArray[idx + 3] = 0
        lineColArray[idx + 4] = 0
        lineColArray[idx + 5] = 0
      }

      linePosAttr.needsUpdate = true
      lineColAttr.needsUpdate = true

      // Update binary digit streams
      for (let i = 0; i < BINARY_COUNT; i++) {
        const digit = digits[i]
        digit.sprite.position.x += digit.vx
        digit.sprite.position.y += digit.vy
        digit.sprite.position.z += digit.vz

        // Wrap around when escaping limits
        if (digit.sprite.position.y > boxH / 2) {
          digit.sprite.position.y = -boxH / 2
          digit.sprite.position.x = (Math.random() - 0.5) * boxW
        }
        if (Math.abs(digit.sprite.position.x) > boxW / 2) {
          digit.vx *= -1
        }
        if (Math.abs(digit.sprite.position.z) > boxD / 2) {
          digit.vz *= -1
        }

        // Pulse opacity slightly based on position
        const mat = digit.sprite.material as THREE.SpriteMaterial
        mat.opacity = 0.18 + Math.sin(rotX * 5 + i) * 0.12
      }

      renderer.render(scene, camera)
    }

    animate()

    // 8. Cleanup WebGL context & listeners
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      observer.disconnect()

      // Dispose ThreeD resources safely to prevent leaks
      nodes.length = 0
      digits.length = 0
      nodeGeometry.dispose()
      nodeMaterial.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      goldNodeTex.dispose()
      tealNodeTex.dispose()
      zeroTex.dispose()
      oneTex.dispose()
      zeroMat.dispose()
      oneMat.dispose()

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [liteMode, isMobile])

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full z-[1] pointer-events-none overflow-hidden" 
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
