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
            className={`block w-full h-full rounded-lg shadow-lg p-6 text-center transition-transform duration-200 
            ${curso.VideosVistos === 0 ? "bg-red-300" : "bg-cyan-500"} 
            hover:scale-105 hover:shadow-xl`}
            onClick={PrimerVideo}
        >
            <div className="h-full w-full overflow-hidden flex flex-col justify-between bg-transparent  p-0">
                <h3 className="text-lg font-bold text-gray-800 ">{curso.NombreCurso}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 ">{curso.DescripcionCurso}</p>
                <div className="mt-4">
                    <p className="text-sm text-gray-600">Progreso: {Progreso.toFixed(2)}%</p>
                    <Progress value={Progreso} className="w-full mt-2 h-2 rounded-full bg-white shadow-md" />
                </div>
            </div>
        </Link>
    );
    
};
