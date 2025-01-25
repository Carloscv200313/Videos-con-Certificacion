"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AlignJustify, CircleX,CircleCheckBig  } from "lucide-react";
import Loader from "./ui/Carga";

interface Props {
    idUsuario: string;
    idCurso: string;
    idVideo: string;
}

interface Video {
    VideoId: number;
    Titulo: string;
    Link: string;
    Orden: number;
    Estado: boolean;
    VideoVisto: boolean;
}

const SidebarMenu = ({ vistas, idUsuario, idCurso }: { vistas: Video[]; idUsuario: string; idCurso: string }) => (
<div className="flex flex-col h-full items-start justify-start w-full gap-0">
    {vistas.map((vista, id) => (
        <div
            key={id}
            className={`${
                vista.Estado ? "text-white" : "cursor-not-allowed bg-neutral-800"
            } w-full px-2 py-4 text-gray-500`}
        >
            {vista.Estado ? (
                <Link
                    href={`/Empleado/${idUsuario}/${idCurso}/${vista.VideoId}`}
                    className="flex flex-row w-full text-base justify-between items-center"
                >
                    <span className="line-clamp-2 overflow-hidden text-ellipsis">
                        {vista.Titulo}
                    </span>
                    {
                        vista.VideoVisto ? <CircleCheckBig className="text-green-600 w-5 h-5 flex-shrink-0" /> :""
                    }
                </Link>
            ) : (
                <span className="flex flex-row w-full text-base line-clamp-2 overflow-hidden text-ellipsis">
                    {vista.Titulo}
                </span>
            )}
        </div>
    ))}
</div>

);

export const Sidebar = ({ idUsuario, idCurso, idVideo }: Props) => {
    const [vistas, setVistas] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        const obtenerVideos = async () => {
            try {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/videos`, {
                    method: "POST",
                    body: JSON.stringify({ idUsuario, idCurso }),
                    credentials: 'include', // Incluye las cookies en la solicitud
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const videos = await resp.json();
                setVistas(videos);
                console.log(videos);
            } catch (error) {
                console.error("Error al obtener los videos:", error);
            } finally {
                setIsLoading(false); // Cambiar estado después de cargar los datos
            }
        };
        obtenerVideos();
    }, [idCurso, idUsuario,idVideo]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <nav className="h-screen md:flex flex-col gap-2 py-10 w-44 hidden bg-[#0f0a1e] ">
                <Image
                    src={"/logo.png"}
                    alt={"logo"}
                    width={150}
                    height={200}
                    priority
                    className="w-auto h-auto"
                />
                <SidebarMenu vistas={vistas} idUsuario={idUsuario} idCurso={idCurso} />
                <footer>
                    <p className="px-4 py-2 text-sm text-muted-foreground text-center">© 2024 Expertis</p>
                </footer>
            </nav>
            <div className="md:hidden w-full flex justify-end p-2 bg-gray-100">
                <button className="w-5 h-5" onClick={() => setIsOpen(!isOpen)}>
                    <AlignJustify />
                </button>
            </div>
            {isOpen && (
                <div className="absolute inset-0 md:hidden h-screen bg-gray-100 flex flex-col items-center justify-center gap-6 z-50">
                    <button className="absolute top-2 right-2 rounded-full" onClick={() => setIsOpen(false)}>
                        <CircleX className="text-red-800 w-12 h-12" />
                    </button>
                    <SidebarMenu vistas={vistas} idUsuario={idUsuario} idCurso={idCurso} />
                </div>
            )}
        </>
    );
};
