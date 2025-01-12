'use client'
import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'

interface Props {
  idVideo: string
  idUsuario: string
  idCurso: string
}

interface Video {
  VideoId: number
  Titulo: string
  Link: string
  Orden: number
  Estado: boolean
  idVideoSiguiente: number
}

interface SiguienteVideo{
  id: number
  titulo: string
} 

export default function DefaultVideoProgressPlayer({ idVideo, idUsuario, idCurso}: Props) {
  const [videos, setVideo] = useState<Video[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [siguienteVideo, setSiguienteVideo] = useState<SiguienteVideo[]>([{id: 0, titulo: ""}])
  const [isNextButtonVisible, setNextButtonVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const obtenerVideo = async () => {
      try {
        const datos = await fetch(`/api/videos/${idVideo}`, {
          method: "POST",
          body: JSON.stringify({ idUsuario, idCurso ,siguienteVideo : false})
      });
        const dato = await datos.json()
        setVideo(dato)
        console.log(dato)
      } catch (error) {
        console.error("Error al obtener el video:", error)
      }
    }
    obtenerVideo()
  }, [idCurso, idVideo, idUsuario])
  const handleNextVideo = async () => {
    try {
      const resp = await fetch(`/api/videos/${idVideo}`, {
        method: "POST",
        body: JSON.stringify({ idUsuario, idCurso, siguienteVideo: true })
    });
      const video = await resp.json()
      setSiguienteVideo(video)
      console.log(video)
    } catch (error) {
      console.error("Error al obtener el video:", error)
    }
    setNextButtonVisible(false)
    videoRef.current?.play()
  }
  return (
    
    <div className="max-w-md mx-auto mt-0 p-6 bg-white rounded-lg shadow-md">
      {videos.length > 0 ? (
        <video
          ref={videoRef}
          className="w-full mb-4 rounded"
          onEnded={()=> setNextButtonVisible(true)}
          controls
          disablePictureInPicture
          aria-label="Video predeterminado"
          src={videos[0].Link}

        >
          Tu navegador no soporta el elemento de video.
        </video>
      ) : (
        <p className="text-gray-600">Cargando video...</p>
      )}
      {isNextButtonVisible &&  videos[0].idVideoSiguiente && (
        <Link 
          onClick={handleNextVideo}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          href={`/Empleado/${idUsuario}/${idCurso}/${videos[0].idVideoSiguiente}`}> 
          Siguiente video
        </Link>
      )}
    </div>
  )
}
