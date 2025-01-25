'use client'
import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'
import Loader from './ui/Carga';
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
  VideoVisto: boolean
  idVideoSiguiente: number
}

interface SiguienteVideo {
  id: number
  titulo: string
}

export default function DefaultVideoProgressPlayer({ idVideo, idUsuario, idCurso }: Props) {
  const [videos, setVideo] = useState<Video[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [siguienteVideo, setSiguienteVideo] = useState<SiguienteVideo[]>([{ id: 0, titulo: "" }])
  const [isNextButtonVisible, setNextButtonVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const obtenerVideo = async () => {
      try {
        const datos = await fetch(`/api/videos/${idVideo}`, {
          method: "POST",
          body: JSON.stringify({ idUsuario, idCurso, siguienteVideo: false })
        });
        const dato = await datos.json()
        setVideo(dato)
        console.log(dato)
      } catch (error) {
        console.error("Error al obtener el video:", error)
      } finally {
        setIsLoading(false); // Cambiar estado después de cargar los datos
      }
    }
    obtenerVideo()
  }, [idCurso, idVideo, idUsuario])


  const VideoTerminado = async () => {
    setNextButtonVisible(true)
    if (!videos[0].VideoVisto) {
      try {
        const resp = await fetch(`/api/videos/${idVideo}`, {
          method: "PUT",
          body: JSON.stringify({ idUsuario, idCurso })
        });
        const video = await resp.json()
        console.log(video)
      } catch (error) {
        console.error("Error al obtener el video:", error)
      }
    }
  }



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
  }
  return (
    <>
      {
        isLoading ? <Loader /> : null
      }
      <div className={`${isLoading ? "hidden" : "flex"} w-full mt-0 p-0 bg-[#1d1238] rounded-lg  flex-col justify-center items-center gap-0 pt-5`}>
        <h1 className='text-5xl text-white font-serif w-full text-start pl-10 pb-5'>
          {videos[0]?.Titulo || "Sin título disponible"}
        </h1>
        {videos.length > 0 ? (
          <video
            ref={videoRef}
            className="w-1/4 mb-2 rounded"
            onEnded={VideoTerminado}
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
        {isNextButtonVisible && videos[0].idVideoSiguiente && (
          <Link
            onClick={handleNextVideo}
            className="mt-0 px-4 py-2 bg-[#0f0a1e] text-white rounded hover:bg-[#0f0a1e]"
            href={`/Empleado/${idUsuario}/${idCurso}/${videos[0].idVideoSiguiente}`}>
            Siguiente video
          </Link>
        )}
      </div>
    </>
  )
}
