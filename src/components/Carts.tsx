"use client"
import React, { useEffect, useState } from 'react'
import { Cart } from './ui/Cart'
import Loader from './ui/Carga';
interface Props {
    idEmpleado: string;
}
interface Curso {
    Progreso: number;
    Usuario: string;
    CursoId: number;
    NombreCurso: string;
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
                    Mis Cursos
                </h1>
                <div className="grid grid-cols-1 px-10 md:grid-cols-2 lg:grid-cols-3 gap-10 flex-wrap">
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