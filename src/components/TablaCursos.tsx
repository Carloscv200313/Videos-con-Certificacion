"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";
import Loader from "./ui/Carga";
import {Error} from "./Error";

interface Prop {
    CursoId: string;
}

interface Datos {
    UsuarioId: number;
    NombreUsuario: string;
    VideosVistos: number;
    ExamenHabilitado: boolean;
    NotaFinalCurso: number;
    CantidadCursos: number;
}

export const TablaCursos = ({ CursoId }: Prop) => {
    const [datos, setDatos] = useState<Datos[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const res = await fetch("/api/cursos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ CursoId }),
                });
                const data = await res.json();
                setDatos(data);
                console.log("Datos obtenidos:", data);
            } catch (err) {
                console.error("Error en obtenerDatos:", err);
            } finally {
                setLoading(false);
            }
        };

        obtenerDatos();
    }, [CursoId]);

    // Calcular el máximo número de videos vistos
    const maxVideos = datos.length > 0
        ? Math.max(...datos.map((d) => d.CantidadCursos || 0))
        : 0;

    if (loading) {
        return <Loader/>
    }
    if (datos.length === 0) {
        return <Error/>
    }
    return (
        <Table>
            <TableHeader>
                <TableRow className="text-white">
                    <TableHead> Nombre de Usuario</TableHead>
                    {[...Array(maxVideos)].map((_, index) => (
                        <TableHead key={index}>
                            Video_{(index + 1).toString().padStart(2, "0")}
                        </TableHead>
                    ))}
                    <TableHead>Examen Habilitado</TableHead>
                    <TableHead>Nota Final</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {datos.map((usuario) => (
                    <TableRow key={usuario.UsuarioId}>
                        <TableCell>{usuario.NombreUsuario}</TableCell>
                        {[...Array(maxVideos)].map((_, index) => (
                            <TableCell key={index}>
                                {index < usuario.VideosVistos ? (
                                    <CheckCircle className="text-green-500" />
                                ) : (
                                    <XCircle className="text-red-500" />
                                )}
                            </TableCell>
                        ))}
                        <TableCell>
                            {usuario.ExamenHabilitado ? (
                                <CheckCircle className="text-green-500" />
                            ) : (
                                <XCircle className="text-red-500" />
                            )}
                        </TableCell>
                        <TableCell>
                            <span
                                className={`font-bold ${usuario.NotaFinalCurso >= 11
                                        ? "text-green-500"
                                        : "text-red-500"
                                    }`}
                            >
                                {usuario.NotaFinalCurso}
                            </span>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
