'use client'

import { useEffect, useRef, useState } from 'react'

interface AudioWaveformProps {
  analyser: AnalyserNode | null
  isRecording: boolean
}

/**
 * Audio waveform visualization component
 * Shows animated bars similar to iPhone Voice Memos
 */
export function AudioWaveform({ analyser, isRecording }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [bars] = useState(32) // Number of bars to display

  useEffect(() => {
    if (!analyser || !isRecording || !canvasRef.current) {
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isRecording) return

      analyser.getByteFrequencyData(dataArray)

      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      const barWidth = width / bars
      const barGap = 2

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Calculate bars with some smoothing
      for (let i = 0; i < bars; i++) {
        // Sample the frequency data
        const dataIndex = Math.floor((i / bars) * bufferLength)
        let barHeight = (dataArray[dataIndex] / 255) * height

        // Add some minimum height for visual effect
        barHeight = Math.max(barHeight, 4)

        // Apply some smoothing
        barHeight = barHeight * 0.8 + 0.2 * height * 0.1

        const x = i * barWidth
        const y = (height - barHeight) / 2

        // Gradient for bars
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
        gradient.addColorStop(0, '#3b82f6') // blue-500
        gradient.addColorStop(1, '#1d4ed8') // blue-700

        ctx.fillStyle = gradient
        ctx.fillRect(x + barGap / 2, y, barWidth - barGap, barHeight)
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [analyser, isRecording, bars])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-32 rounded-lg"
      style={{ width: '100%', height: '128px' }}
    />
  )
}
