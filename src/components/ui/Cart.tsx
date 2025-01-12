import React from 'react'
import Image from 'next/image'
import { Progress } from "@/components/ui/progress"
import Link from 'next/link'
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
export const Cart = ({ curso ,idEmpleado}: Props) => {
    const Progreso = (curso.VideosVistos / curso.CantidadVideos) * 100;
    const PrimerVideo= async()=>{
        try {
            const resp = await fetch(`/api/${idEmpleado}`,{
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
    return (
        <div className="flex justify-center items-center ">
            <div className="max-w-[720px] mx-auto">
                <div className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
                    <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl h-96">
                        <Image
                            src="/12.jpg"
                            width={927}
                            height={617}
                            alt="card-image" className="object-cover w-full h-full" />
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                                {curso.NombreCurso}
                            </p>
                        </div>
                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                            {curso.DescripcionCurso}
                        </p>
                    </div>
                    <div className='p-6'>
                        <Progress value={Progreso} className="w-full mb-2" aria-label="Progreso del video" />
                        <span>Progreso: {Progreso}%</span>
                    </div>
                    <div className="p-6 pt-0">
                        <Link 
                            href={`/Empleado/${idEmpleado}/${curso.CursoId}/${curso.PrimerVideoId}`} 
                            className={`${curso.VideosVistos === 0 ? "bg-red-300" : "bg-cyan-500"} align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100`}
                            onClick={PrimerVideo}>
                            {curso.VideosVistos === 0 ? "Comenzar Curso" : "Seguir Viendo"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}