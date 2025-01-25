"use client"
import React, { useEffect, useState } from 'react'
import { Cart } from './ui/Cart'
import Loader from './ui/Carga';
import Link from 'next/link';
interface Props {
    idEmpleado: string;
}
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

export const Carts = ({ idEmpleado }: Props) => {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const obtenerCursos = async () => {
            try {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/${idEmpleado}`,{
                    method:"GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                } );
                
                // Verificar si la respuesta fue exitosa
                if (!resp.ok) {
                    throw new Error(`Error al obtener los cursos: ${resp.statusText}`);
                }
                
                const cursos = await resp.json();
                setCursos(cursos);
                console.log(cursos);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                } else {
                    console.error('Error desconocido', error);
                }
            } finally {
                setIsLoading(false); // Cambiar estado después de cargar los datos
            }
        };
        obtenerCursos();
    }, [idEmpleado]);     
    return (
        <>
            {
                isLoading ? <Loader /> : null
            }
            <div className={`${isLoading ? "hidden" : ""}`} >
                <h1 className='text-4xl font-bold font-serif text-center my-10 '>
                    Bienvenido {cursos.length > 0 ? cursos[0].Usuario : ''} a tus cursos
                </h1>
                <div className="grid grid-cols-1 px-10 md:grid-cols-3 lg:grid-cols-4 gap-10 flex-wrap">
                    <Link
                        href={`/Examenes/${idEmpleado}`}
                        className={`block w-full h-full rounded-lg shadow-lg p-6 text-center transition-transform duration-200 bg-[#0f0a1e] hover:scale-105 hover:shadow-xl`}
                    >
                        <div className="text-start h-full w-full overflow-hidden flex flex-col justify-between bg-transparent mb-5">
                            {/* Título del contenido */}
                            <h3 className="text-2xl font-bold text-white font-mono">
                                Evaluaciones y certificados
                            </h3>
                            {/* Descripción del contenido */}
                            <p className="text-lg text-neutral-300 line-clamp-3">
                                Accede fácilmente a las evaluaciones de los cursos que has completado.
                            </p>
                            {/* Enlace de acción */}
                            <div className="mt-4">
                                <p className="text-end mt-3 text-lg font-sans text-blue-100">
                                    {"Explorar ahora >>>"}
                                </p>
                            </div>
                        </div>
                    </Link>

                    {
                        cursos.map((curso, key) => (
                            <div key={key} >
                                <Cart curso={curso} idEmpleado={idEmpleado} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}