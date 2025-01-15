import React from 'react'
import Link from 'next/link';
interface CursoProps {
    curso : {
        CursoId: number
        NombreCurso: string
        DescripcionCurso: string
    } 
}
export const Curso = ({curso}: CursoProps) => {
    return (
        <Link
            href={`/Gerente/${curso.CursoId}`}
            className={`bg-[#0f0a1e] text-white block w-full h-full rounded-lg shadow-lg p-6 text-center transition-transform duration-200 hover:scale-105 hover:shadow-xl`}
        >
            <div className="h-full w-full overflow-hidden flex flex-col justify-between bg-transparent  p-0">
                <h3 className="text-2xl font-mono font-bold ">
                    {curso.NombreCurso}
                </h3>
                <p className="text-lg font-sans line-clamp-1 pt-8 ">
                    {curso.DescripcionCurso}
                </p>
                <p className="text-end text-lg font-sans line-clamp-1 pt-8 border-b-2 ">
                    Supervisar
                </p>
            </div>
        </Link>
    )
}
