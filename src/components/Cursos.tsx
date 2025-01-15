"use client"
import React, { useEffect, useState } from 'react'
import { Curso } from './ui/Curso'

export const Cursos = () => {
    const [cursos, setCursos] = useState([])
    useEffect(() => {
        const obtenerCursor = async () => {
            try {
                const res = await fetch('/api/cursos')
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
        <div className="grid grid-cols-1 px-10 pt-32 md:grid-cols-3 lg:grid-cols-3 gap-10 flex-wrap">
            {
                cursos.map((curso, index) => (
                    <div key={index}>
                        <Curso curso={curso} />
                    </div>))
            }
        </div>
    )
}
