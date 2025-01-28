"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AlignJustify, CircleX, Check, LoaderCircle } from "lucide-react";
import Loader from "./ui/Carga";
import { CursoNombre } from "./ui/CursoNombre";
import '@fontsource/yeseva-one';
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
    <div className="gap-0 flex flex-col items-start justify-evenly w-full">
        {vistas.map((vista, id) => (
            <div
                key={id}
                className={`${vista.Estado ? "text-white" : "cursor-not-allowed "
                    } w-full px-5  text-gray-500 `}
            >
                {vista.Estado ? (
                    <Link
                        href={`/Empleado/${idUsuario}/Cursos/${idCurso}/${vista.VideoId}`}
                        className="font-serif py-5 flex flex-row w-full text-base justify-between items-center gap-0 border-b-2 border-neutral-500"
                    >
                        <span className="line-clamp-1 overflow-hidden text-ellipsis">
                            {vista.Titulo}
                        </span>
                        {
                            vista.VideoVisto ? <Check className="text-white bg-[#310a70] rounded-full p-1  w-6 h-6 flex-shrink-0" /> : <LoaderCircle className="text-white bg-[#310a70] rounded-full p-1  w-6 h-6 flex-shrink-0" />
                        }
                    </Link>
                ) : (
                    <span className="font-serif py-5 flex flex-row w-full text-base   overflow-hidden line-clamp-1 text-ellipsis border-b-2 border-neutral-500">
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
    const [examen, setExamen] = useState(false);
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
    }, [idCurso, idUsuario, idVideo]);

    if (isLoading && examen) {
        return <Loader />;
    }
    return (
        <>
            <nav className="h-full xl:h-full flex flex-col justify-between gap-2 py-5 w-96 bg-[#2e2e2e] overflow-y-auto">
                <CursoNombre idEmpleado={idUsuario} idCurso={idCurso} setExamen={setExamen} />
                <SidebarMenu vistas={vistas} idUsuario={idUsuario} idCurso={idCurso} />
                <footer className="w-full flex flex-col items-center justify-center mt-5">
                    {examen ? (
                        <Link
                            className="mt-0 px-4 py-2 bg-[#310a70] text-white rounded-xl hover:bg-[#310a70] w-1/2 text-center"
                            href={`/Empleado/${idUsuario}/Certificados`}>
                            Examen
                        </Link>
                    ) : (<p className="px-4 pt-2 text-sm text-muted-foreground text-center">© 2025 Expertis</p>)}
                    
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
