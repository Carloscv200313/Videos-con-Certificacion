"use client"
import React, {  useEffect, useState } from 'react'
import { ProgressInterno } from './progresoInterno';
import Link from 'next/link';
import '@fontsource/yeseva-one';
interface Curso {
    Progreso: number;
    Usuario: string;
    CursoId: number;
    NombreCurso: string;
    DescripcionCurso: string;
    VideosVistos: number;
    CantidadVideos: number;
    PrimerVideoId: number;
}
interface Props {
    idEmpleado: string;
    idCurso: string
    setExamen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const CursoNombre = ({ idEmpleado, idCurso, setExamen }: Props) => {
    const [cursos, setCursos] = useState<Curso>();
    const [Progreso, SetProgress] = useState(0);
    useEffect(() => {
        const obtenerCursos = async () => {
            try {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/${idEmpleado}`, {
                    method: "POST",
                    body: JSON.stringify({ idCurso }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                });

                // Verificar si la respuesta fue exitosa
                if (!resp.ok) {
                    throw new Error(`Error al obtener los cursos: ${resp.statusText}`);
                }
                const curso = await resp.json(); // Esperar el objeto del backend
                setCursos(curso); // Guardar en el estado
                console.log("Curso recibido:", curso); // Verificar el objeto
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                } else {
                    console.error('Error desconocido', error);
                }
            }
        };
        obtenerCursos();
    }, [idEmpleado, idCurso]);
    
    useEffect(() => {
        const Progres = cursos ? (cursos.VideosVistos / cursos.CantidadVideos) * 100 : 0;
        SetProgress(Progres)
        if (Progres === 100) {
            setExamen(true);
        }
    }, [cursos, setExamen])
    return (
        <>
            <div className={` h-auto rounded-lg shadow-lg p-3 text-center bg-[#1c1c1c]  mx-2`}>
                <div className="text-start h-full w-full overflow-hidden flex flex-col justify-center bg-transparent ">
                    <Link
                        href={`/Empleado/${idEmpleado}/Cursos`}
                        className="text-md text-neutral-400 text-start font-serif py-4 hover:text-white">
                        {"<< Ver el panel de control"}
                    </Link>
                    {cursos && (
                        <>
                            <h3 className="line-clamp-2 overflow-hidden text-ellipsis text-2xl font-medium text-white font-nuevo ">{cursos.NombreCurso}</h3>
                        </>
                    )}
                    <div className="mt-4">
                        <ProgressInterno value={Progreso} className="w-full mb-2 h-1 rounded-full bg-neutral-600 " />
                        <p className="text-md text-neutral-100 text-start"><span className=' font-mono text-lg'>{Progreso.toFixed(2)}</span> % completado</p>
                    </div>
                </div>
            </div>
        </>
    )
}
