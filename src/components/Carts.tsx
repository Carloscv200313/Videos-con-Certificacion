"use client"
import React, { useEffect,useState } from 'react'
import { Cart } from './ui/Cart'
interface Props {
    idEmpleado: string;
}
interface Curso {
    Progreso : number;
    Usuario : string;
    CursoId : number;
    NombreCurso : string;
    DescripcionCurso: string;
    VideosVistos: number;
    CantidadVideos: number;
    PrimerVideoId: number;
}
export const Carts = ({idEmpleado}:Props) => {
    const [cursos,setCursos] = useState<Curso[]>([]);
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
<div className="flex justify-center items-center gap-10 flex-wrap">
        {
            cursos.map((curso,key) => (
                <div key={key} >
                    <Cart curso={curso} idEmpleado={idEmpleado} />
                </div>
            ))
        }
</div>
    )
}
