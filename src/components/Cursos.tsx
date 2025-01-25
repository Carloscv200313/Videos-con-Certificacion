"use client"
import React, { useEffect, useState } from 'react'
import { Curso } from './ui/Curso'

export const Cursos = () => {
    const [cursos, setCursos] = useState([])
    useEffect(() => {
        const obtenerCursor = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cursos`,{
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                } )
                const data = await res.json()
                setCursos(data)
                console.log(data)
            } catch (err) {
                console.log(err)
            }
        }
        obtenerCursor()
    }, [])
    return (
        <div className='flex flex-col items-center gap-10 pt-10'>
            <h1 className="text-white text-6xl font-serif w-full text-center">Bienvenido Carlos Calderon</h1>
            <div className="grid grid-cols-1 px-10 md:grid-cols-3 lg:grid-cols-3 gap-10 flex-wrap">
                {
                    cursos.map((curso, index) => (
                        <div key={index}>
                            <Curso curso={curso} />
                        </div>))
                }
            </div>
        </div>
    )
}
