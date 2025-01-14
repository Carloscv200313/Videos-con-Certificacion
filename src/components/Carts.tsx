"use client"
import React, { useEffect, useState } from 'react'
import { Cart } from './ui/Cart'
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
    useEffect(() => {
        const obtenerCursos = async () => {
            try {
                const resp = await fetch(`/api/${idEmpleado}`);
                const cursos = await resp.json();
                setCursos(cursos);
                console.log(cursos);
            } catch (error) {
                console.error("Error al obtener los cursos:", error);
            }
        };

        obtenerCursos();
    }, [idEmpleado]);
    return (
        <>
        <h1 className='text-3xl font-bold text-center mb-12'>
            Bienvenido {cursos.length > 0 ? cursos[0].Usuario : ''} a tus cursos
        </h1>
        <div className="grid grid-cols-1 px-10 md:grid-cols-3 lg:grid-cols-4 gap-10 flex-wrap">
            {
                cursos.map((curso, key) => (
                    <div key={key} >
                        <Cart curso={curso} idEmpleado={idEmpleado} />
                    </div>
                ))
            }
        </div>
        </>
    )
}