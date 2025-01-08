"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { BarChart3, Home, ShoppingBag, ShoppingCart, Users, AlignJustify,CircleX } from 'lucide-react'
export const Sidebar = () => {
    const Vistas = [
        { nombre: "Home", src: "/Empleado", icon: Home },
        { nombre: "Video 1", src: "/Empleado/video_01", icon: Users },
        { nombre: "Video 2", src: "/Empleado/video_02", icon: BarChart3 },
        { nombre: "Video 3", src: "/Empleado/video_03", icon: ShoppingCart },
        { nombre: "Video 4", src: "/Empleado/video_04", icon: ShoppingBag },
    ]
    const [isOpen, setIsOpen] = useState(false);
    const hamburguesa = () => {
        setIsOpen(!isOpen);
    }
    return (
        <>
            <nav className='h-screen md:flex flex-col  gap-2  py-10 w-44 hidden' >
                <Image
                    src={'/logo_SF.png'}
                    alt={'logo'}
                    width={150}
                    height={200}
                    priority
                    className='w-auto h-auto'
                />
                <div className='flex flex-col h-screen items-start justify-center w-full gap-4'>
                    {
                        Vistas.map((vista, id) => (
                            <div key={id} className='hover:bg-zinc-200 w-full px-4 py-2 text-gray-500 hover:text-black '>
                                <Link href={vista.src} className='flex flex-row w-full text-base '>
                                    <vista.icon className="mr-2 h-5 w-5" /> {vista.nombre}
                                </Link>
                            </div>
                        ))
                    }
                </div>
                <footer>
                    <p className="px-4 py-2 text-sm text-muted-foreground text-center">© 2024 Panizzeria</p>
                </footer>
            </nav>
            <div className='md:hidden w-full flex justify-end p-2 bg-gray-100'>
                <button
                    className='w-5 h-5'
                    onClick={hamburguesa}>
                    <AlignJustify />
                </button>
            </div>
            {isOpen && (
                <div className="absolute inset-0 md:hidden h-screen bg-gray-100 flex flex-col items-center justify-center gap-6 z-50">
                    <button
                        className="absolute top-2 right-2 rounded-full "
                        onClick={() => setIsOpen(false)}>
                        <CircleX className="text-red-800 w-12 h-12" />
                    </button>
                    {Vistas.map((vista, id) => (
                        <div key={id} className='hover:bg-zinc-200 w-full px-4 py-2 text-gray-500 hover:text-black '>
                            <Link href={vista.src} className='flex flex-row w-full text-base ' onClick={()=>setIsOpen(false)} >
                                <vista.icon className="mr-2 h-5 w-5" /> {vista.nombre}
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
