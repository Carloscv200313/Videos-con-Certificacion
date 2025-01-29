"use client"
import Link from "next/link";
import React, { useEffect } from "react";
import Image from "next/image";
import { useState } from "react";
import { AlignJustify, CircleX, ArrowLeftFromLine, House, Clapperboard, ShieldCheck } from "lucide-react";
import '@fontsource/koulen';
import { usePathname } from "next/navigation";

interface Vista {
    id: number,
    titulo: string;
    icon: React.ElementType
}
interface Vistas {
    vistas: Vista[]
}

const SidebarMenu = ({ vistas }: Vistas) => {
    const [id, setId] = useState<string | null>(null);
    const link= usePathname()
    const ruta = link.split("/").filter(Boolean).pop()
    useEffect(() => {
        // Este código solo se ejecutará en el cliente
        const storedId = localStorage.getItem("id");
        setId(storedId);
    }, []);
    return (
        <div className="flex flex-col h-full items-center justify-start w-full gap-5">
            {vistas.map((vista) => {
                const Icon = vista.icon; // Asigna el componente dinámicamente
                return (
                    <div
                        key={vista.id}
                        className={`bg-transparent w-full p-2 text-gray-400  hover:text-white`}
                    >
                        <Link
                            href={`/Empleado/${id}/${vista.titulo}`}
                            className={`${vista.titulo==ruta?"bg-blue-900 p-3 rounded-xl text-white":"bg-transparent p-3"} flex flex-row w-full text-xl justify-start items-center font-sidebarPrincipal `}
                        >
                            <Icon className="mr-2 w-5 h-5" /> {/* Renderiza el ícono */}
                            {vista.titulo}
                        </Link>
                    </div>
                );
            })}
        </div>
    )
}
export const SidebarPrincipal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const vistas = [{ id: 1, titulo: "Home", icon: House }, { id: 2, titulo: "Cursos", icon: Clapperboard }, { id: 3, titulo: "Certificados", icon: ShieldCheck }]
    const Salir = async () => {
        localStorage.clear();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/delete-cookie`, { method: "POST" });
            const data = await response.json();
            console.log(data.message); // "Cookie eliminada"
        } catch (error) {
            console.error("Error al eliminar la cookie:", error);
        }
    };

    return (
        <>
            <nav className="h-screen md:flex flex-col gap-2 pt-10 w-52 hidden bg-[#0f0a1e] items-center ">
                <Image
                    src={"/logo.png"}
                    alt={"logo"}
                    width={150}
                    height={200}
                    priority
                    className="w-4/5 h-auto mb-16 "
                />
                <SidebarMenu vistas={vistas} />
                <footer className="flex flex-col items-center justify-center w-full">
                    <Link href={"/"} onClick={Salir} 
                    className="p-3 pb-10 text-gray-400 text-xl font-sidebarPrincipal w-full  flex gap-2 hover:text-white ">
                        <div className="hover:bg-red-500 flex flex-row w-full gap-2 items-center p-3 rounded-xl">
                        <ArrowLeftFromLine className=" w-5 h-5 flex-shrink-0" />
                        Salir
                        </div>
                    </Link>
                </footer>
            </nav>
            <div className="md:hidden w-full flex justify-end p-2 bg-gray-100">
                <button className="w-5 h-5" onClick={() => setIsOpen(!isOpen)}>
                    <AlignJustify />
                </button>
            </div>
            {isOpen && (
                <div className="absolute inset-0 md:hidden h-screen bg-gray-100 flex flex-col items-center justify-center gap-6 z-50">
                    <button className="absolute top-2 right-2 rounded-full" onClick={() => setIsOpen(false)}>
                        <CircleX className="text-red-800 w-12 h-12" />
                    </button>
                    <SidebarMenu vistas={vistas} />
                </div>
            )}
        </>
    );
};
