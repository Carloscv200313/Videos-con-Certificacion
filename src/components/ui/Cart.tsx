import React from 'react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

interface Props {
    curso: {
        VideosVistos: number;
        Usuario: string;
        CursoId: number;
        NombreCurso: string;
        DescripcionCurso: string;
        CantidadVideos: number;
        PrimerVideoId: number;
    }
    idEmpleado: string;
}

export const Cart = ({ curso, idEmpleado }: Props) => {
    const Progreso = (curso.VideosVistos / curso.CantidadVideos) * 100;

    const PrimerVideo = async () => {
        if (curso.VideosVistos < 1) {
            try {
                const resp = await fetch(`/api/${idEmpleado}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        CursoId: curso.CursoId,
                        PrimerVideoId: curso.PrimerVideoId,
                    }),
                });
                const cursos = await resp.json();
                console.log(cursos);
            } catch (error) {
                console.error("Error al obtener los cursos:", error);
            }
        }
    };

    return (
        <Link
            href={`/Empleado/${idEmpleado}/${curso.CursoId}/${curso.PrimerVideoId}`}
            className={`block w-full h-full rounded-lg shadow-lg p-6 text-center transition-transform duration-200 bg-[#0f0a1e] hover:scale-105 hover:shadow-xl`}
            onClick={PrimerVideo}
        >
            <div className="text-start h-full w-full overflow-hidden flex flex-col justify-between bg-transparent  mb-5">
                <h3 className="text-2xl font-bold text-white font-mono ">{curso.NombreCurso}</h3>
                <p className="text-lg text-neutral-300 line-clamp-1 ">{curso.DescripcionCurso}</p>
                <div className="mt-4">
                    <p className="text-sm text-neutral-300 text-end">{Progreso.toFixed(2)}%</p>
                    <Progress value={Progreso} className="w-full mt-2 h-1 rounded-full bg-black " />
                    <p className='text-end mt-3 text-lg font-sans '>
                        {Progreso > 0 ? "Continuar curso" : "Comenzar Curso"}
                    </p>
                </div>
            </div>
        </Link>
    );

};
