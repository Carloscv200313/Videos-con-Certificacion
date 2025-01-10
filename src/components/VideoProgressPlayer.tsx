'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"

interface Props {
  video: string
  id: string
  cursos: string
}

interface Video {
  url: string
}

export default function DefaultVideoProgressPlayer({ video, id , cursos}: Props) {
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [videos, setVideo] = useState<Video[]>([])
  const [isNextButtonVisible, setNextButtonVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const obtenerVideo = async () => {
      try {
        const idCurso = id
        const datos = await fetch(`/api/${idCurso}/${video}`)
        const dato = await datos.json()
        setVideo(dato)
        console.log(dato)
      } catch (error) {
        console.error("Error al obtener el video:", error)
      }
    }
    obtenerVideo()
  }, [video, id])

  const handleTimeUpdate = async () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime
      const duration = videoRef.current.duration
      const calculatedProgress = (currentTime / duration) * 100
      setProgress(calculatedProgress)
      setDuration(duration)

      // Enviar el tiempo visualizado al servidor
      try {
        const idCurso = id
        await fetch(`/api/${idCurso}/${video}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tiempoVisto: currentTime,
            cursos
          })
        })
      } catch (error) {
        console.error("Error al guardar el progreso:", error)
      }
    }
  }

  const handleVideoEnd = () => {
    
    setNextButtonVisible(true)
  }

  const handleNextVideo = async () => {
    // Realizar la petición para habilitar el siguiente video
    try {
      const response = await fetch(`/api/siguienteVideo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idCurso: id, idVideo: video })
      })
      const nextVideoData = await response.json()
      console.log(nextVideoData)
      // Aquí podrías actualizar el estado para cargar el siguiente video
    } catch (error) {
      console.error("Error al obtener el siguiente video:", error)
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
      {videos.length > 0 ? (
        <video
          ref={videoRef}
          className="w-full mb-4 rounded"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          controls
          aria-label="Video predeterminado"
          src={videos[0].url}
        >
          Tu navegador no soporta el elemento de video.
        </video>
      ) : (
        <p className="text-gray-600">Cargando video...</p>
      )}
      <div className="flex justify-between text-sm text-gray-600">
        <span>Progreso: {progress.toFixed(1)}%</span>
        <span>Tiempo restante: {formatTime(remainingTime)}</span>
      </div>
      {isNextButtonVisible && (
        <button
          onClick={handleNextVideo}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Siguiente Video
        </button>
      )}
    </div>
  )
}
