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

export default function DefaultVideoProgressPlayer({ idVideo, idUsuario, idCurso }: Props) {
  const [videos, setVideo] = useState<Video[]>([]) 
  const [isNextButtonVisible, setNextButtonVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true);
  const [lastWatchedTime, setLastWatchedTime] = useState(0); // Almacena el tiempo visto

  useEffect(() => {
    const obtenerVideo = async () => {
      try {
        const datos = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/videos/${idVideo}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ idUsuario, idCurso, siguienteVideo: false })
        });
        const dato = await datos.json()
        setVideo(dato)
        console.log(dato)
      } catch (error) {
        console.error("Error al obtener el video:", error)
      } finally {
        setIsLoading(false);
      }
    }
    obtenerVideo()
  }, [idCurso, idVideo, idUsuario])

  const VideoTerminado = async () => {
    setNextButtonVisible(true)
    if (!videos[0].VideoVisto) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/videos/${idVideo}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ idUsuario, idCurso })
        });
      } catch (error) {
        console.error("Error al obtener el video:", error)
      }
    }
  }

  const handleNextVideo = async () => {
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/videos/${idVideo}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ idUsuario, idCurso, siguienteVideo: true })
      });
      const video = await resp.json()
      console.log(video);
    } catch (error) {
      console.error("Error al obtener el video:", error)
    }
    setNextButtonVisible(false)
  }

  // Función para evitar adelantar el video manualmente
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      if (currentTime > lastWatchedTime + 1 || videos[0].VideoVisto) { // Si adelanta, lo regresamos
        videoRef.current.currentTime = lastWatchedTime;
      } else {
        setLastWatchedTime(currentTime); // Guardamos el tiempo visto
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className={`${isLoading ? "hidden" : "flex"} w-full mt-0 p-0 bg-[#1c1c1c] rounded-lg  flex-col justify-center items-center gap-0 pt-0`}>
        <h1 className='text-xl text-white font-serif w-full text-start pl-10 pb-5 border-b-2'>
          {videos[0]?.Titulo || "Sin título disponible"}
        </h1>
        {videos.length > 0 ? (
          <video
            ref={videoRef}
            className="w-4/5  mt-10 mb-2 rounded"
            onEnded={VideoTerminado}
            onTimeUpdate={handleTimeUpdate} // Detecta cambios en el tiempo
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
            className="mt-0 px-4 py-2 bg-[#310a70] text-white rounded-xl hover:bg-[#310a70]"
            href={`/Empleado/${idUsuario}/Cursos/${idCurso}/${videos[0].idVideoSiguiente}`}>
            Siguiente video
          </Link>
        )}
      </div>
    </>
  )
}
