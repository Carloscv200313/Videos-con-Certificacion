"use client"
import React, { useEffect,useState } from 'react'
import { Cart } from './ui/Cart'
interface Props {
    id: string;
}
export const Carts = ({id}:Props) => {
    const [cursos,setCursos] = useState([]);
    useEffect(() => {
        const obtenerCursos = async () => {
            try {
                const resp = await fetch("/api/cursos",{
                    method: "POST",
                    body: JSON.stringify({id})
                });
                const cursos = await resp.json();
                setCursos(cursos);
                console.log(cursos);
            } catch (error) {
                console.error("Error al obtener los cursos:", error);
            }
        };
    
        obtenerCursos();
    }, [id]);
    
    return (
<div className="flex justify-center items-center gap-10 flex-wrap">
        {
            cursos.map((curso,key) => (
                <div key={key} >
                    <Cart curso={curso} />
                </div>
            ))
        }
</div>
    )
}
