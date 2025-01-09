"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconEye,IconEyeOff } from '@tabler/icons-react';
export const Form = () => {
    const route = useRouter();
    const [user, setUser] = useState("");
    const [contrasena, setcontrasena] = useState("");
    const [showcontrasena, setShowcontrasena] = useState(false); // Estado para mostrar/ocultar contraseña

    const credenciales = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/auth", {
            method: "POST",
            body: JSON.stringify({ correo: user, contrasena })
        }).then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                } else {
                    if (data.rol === "empleado") {
                        route.push(`/Empleado/${data.id}`);
                        
                    }
                    if (data.rol === "gerente") {
                        route.push("/Gerente");
                        console.log(data);
                    }
                }
            });
    };

    return (
        <form className="space-y-6" onSubmit={credenciales}>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Usuario
                </label>
                <div className="mt-1">
                    <input
                        name="user"
                        type="text"
                        placeholder="Usuario"
                        required
                        className="text-black block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) => { setUser(e.target.value); }}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Contraseña
                </label>
                <div className="mt-1 relative">
                    <input
                        name="contrasena"
                        type={showcontrasena ? "text" : "contrasena"} // Cambiar tipo según el estado
                        placeholder="Contraseña"
                        required
                        className="text-black block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) => { setcontrasena(e.target.value); }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowcontrasena(!showcontrasena)} // Alternar estado
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                    >
                        {showcontrasena ? (
                            <IconEye stroke={2} />
                        ) : (
                            <IconEyeOff stroke={2} />
                        )}
                    </button>
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Iniciar sesión
                </button>
            </div>
        </form>
    );
};
