import React from 'react'
import Image from 'next/image'
import { Progress } from "@/components/ui/progress"
import Link from 'next/link'
interface Props {
    curso: {
        id: number
        nombre: string;
        descripcion: string;
        TotalVideos: number;
        AvancePorcentaje: number;
        idUsuario: number;
    }
}
export const Cart = ({ curso }: Props) => {
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
                                {curso.nombre}
                            </p>
                        </div>
                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                            {curso.descripcion}
                        </p>
                    </div>
                    <div className='p-6'>
                        <Progress value={curso.AvancePorcentaje} className="w-full mb-2" aria-label="Progreso del video" />
                        <span>Progreso: {curso.AvancePorcentaje}%</span>
                    </div>
                    <div className="p-6 pt-0">
                        <Link href={`/Empleado/${curso.idUsuario}/${curso.id}`} className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100">Seguir viendo</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}