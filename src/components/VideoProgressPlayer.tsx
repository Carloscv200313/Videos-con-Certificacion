'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"

interface Props {
  video: string
}

export default function DefaultVideoProgressPlayer({ video }: Props) {
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = `/${video}.mp4`

      // Establecer el tiempo inicial en el segundo 10 cuando se carguen los metadatos
      videoRef.current.addEventListener('loadedmetadata', () => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0
        }
      })
    }
  }, [video])

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime
      const duration = videoRef.current.duration
      const calculatedProgress = (currentTime / duration) * 100
      setProgress(calculatedProgress)
      setDuration(duration)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const remainingTime = duration - (progress / 100 * duration)

  return (
    <div className="max-w-md mx-auto mt-0 p-6 bg-white rounded-lg shadow-md">
      <Progress value={progress} className="w-full mb-2" aria-label="Progreso del video" />
      <video
        ref={videoRef}
        className="w-full mb-4 rounded"
        onTimeUpdate={handleTimeUpdate}
        controls
        aria-label="Video predeterminado"
      >
        Tu navegador no soporta el elemento de video.
      </video>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Progreso: {progress.toFixed(1)}%</span>
        <span>Tiempo restante: {formatTime(remainingTime)}</span>
      </div>
    </div>
  )
}
