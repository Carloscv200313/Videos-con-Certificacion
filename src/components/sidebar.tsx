"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { AlignJustify, CircleX ,CircleCheck } from 'lucide-react'
interface Props {
    idUsuario: string;
    idCurso: string
}
interface Video {
    VideoId: number; 
    Titulo: string;
    Link: string
    Orden:number
    Estado: boolean
}
//        { nombre: "Video 1", src: `/Empleado/${idUsuario}/${idCurso}`, icon: Users },
export const Sidebar = ({ idUsuario, idCurso}: Props) => {

    const [Vistas, setVistas] = useState<Video[]>([]);
    useEffect(() => {
        const obtenerVideos = async () => {
            try {
                const resp = await fetch(`/api/videos`, {
                    method: "POST",
                    body: JSON.stringify({ idUsuario, idCurso })
                });
                const videos = await resp.json();
                setVistas(videos);
                console.log(videos);
            } catch (error) {
                console.error("Error al obtener los cursos:", error);
            }
        };
        obtenerVideos();
    }, [idCurso, idUsuario])
    const [isOpen, setIsOpen] = useState(false);
    const hamburguesa = () => {
        setIsOpen(!isOpen);
    }
    return (
        <>
            <nav className='h-screen md:flex flex-col  gap-2  py-10 w-44 hidden' >
                <Image
                    src={'/logo_SF.png'}
                    alt={'logo'}
                    width={150}
                    height={200}
                    priority
                    className='w-auto h-auto'
                />
                <div className='flex flex-col h-screen items-start justify-center w-full gap-4'>
                    {
                        Vistas.map((vista, id) => (
                            <div
                                key={id}
                                className={`${vista.Estado ? "hover:bg-zinc-200 hover:text-black" : "cursor-not-allowed"
                                    } w-full px-4 py-2 text-gray-500 `}
                            >
                                {vista.Estado ? (
                                    <Link
                                        href={`/Empleado/${idUsuario}/${idCurso}/${vista.VideoId}`}
                                        className="flex flex-row w-full text-base justify-center items-center"
                                    >
                                        {vista.Titulo} <CircleCheck className='text-emerald-500'/>
                                    </Link>
                                ) : (
                                    <span className="flex flex-row w-full text-base">{vista.Titulo}</span>
                                )}
                            </div>
                        ))                          
                    }
                </div>
                <footer>
                    <p className="px-4 py-2 text-sm text-muted-foreground text-center">© 2024 Panizzeria</p>
                </footer>
            </nav>
            <div className='md:hidden w-full flex justify-end p-2 bg-gray-100'>
                <button
                    className='w-5 h-5'
                    onClick={hamburguesa}>
                    <AlignJustify />
                </button>
            </div>
            {isOpen && (
                <div className="absolute inset-0 md:hidden h-screen bg-gray-100 flex flex-col items-center justify-center gap-6 z-50">
                    <button
                        className="absolute top-2 right-2 rounded-full "
                        onClick={() => setIsOpen(false)}>
                        <CircleX className="text-red-800 w-12 h-12" />
                    </button>
                    {Vistas.map((vista, id) => (
                        <div key={id} className='hover:bg-zinc-200 w-full px-4 py-2 text-gray-500 hover:text-black '>
                            <Link href={`/Empleado/${idUsuario}/${idCurso}/${vista.VideoId}`} className='flex flex-row w-full text-base ' onClick={() => setIsOpen(false)} >
                                {vista.Titulo}
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
