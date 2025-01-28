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
import { CheckCircle, XCircle , FilePenLine  } from "lucide-react";
import Loader from "./ui/Carga";
import { Error } from "./Error";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { Button } from "@/components/ui/button";

interface Prop {
    CursoId: string;
}

interface Datos {
    UsuarioId: number;
    NombreUsuario: string;
    VideosVistos: number;
    Intentos: number;
    NotaFinalCurso: number;
    CantidadCursos: number;
    NombreCurso: string;
}

export const TablaCursos = ({ CursoId }: Prop) => {
    const [datos, setDatos] = useState<Datos[]>([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [modalOpen, setModalOpen] = useState(false);
    const [notaEdit, setNotaEdit] = useState<number | null>(null);
    const [usuarioEdit, setUsuarioEdit] = useState<Datos | null>(null);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cursos`, {
                    method: "POST",
                    credentials: "include", // Incluye las cookies en la solicitud
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

    const actualizarNota = async () => {
        if (usuarioEdit && notaEdit !== null) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cursos`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        IdCurso:1,
                        IdAlumno: usuarioEdit.UsuarioId,
                        nota: notaEdit,
                    }),
                });

                if (res.ok) {
                    setDatos((prevDatos) =>
                        prevDatos.map((usuario) =>
                            usuario.UsuarioId === usuarioEdit.UsuarioId
                                ? { ...usuario, NotaFinalCurso: notaEdit }
                                : usuario
                        )
                    );
                    setModalOpen(false);
                } else {
                    console.error("Error al actualizar la nota");
                }
            } catch (err) {
                console.error("Error en la solicitud de actualización:", err);
            }
        }
    };

    // Calcular el máximo número de videos vistos
    const maxVideos =
        datos.length > 0
            ? Math.max(...datos.map((d) => d.CantidadCursos || 0))
            : 0;

    if (loading) {
        return <Loader />;
    }
    if (datos.length === 0) {
        return <Error />;
    }

    return (
        <>
            <h1 className="text-white text-6xl font-serif mb-10">
                {datos[0].NombreCurso}:
            </h1>
            <Table>
                <TableHeader>
                    <TableRow className="text-white">
                        <TableHead>Nombre de Usuario</TableHead>
                        {[...Array(maxVideos)].map((_, index) => (
                            <TableHead key={index}>
                                Video_{(index + 1).toString().padStart(2, "0")}
                            </TableHead>
                        ))}
                        <TableHead>Intentos</TableHead>
                        <TableHead>Nota Final</TableHead>
                        <TableHead>Editar Nota</TableHead>
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
                                {usuario.Intentos < 4 ? (
                                    <p className="text-green-500">{usuario.Intentos}</p>
                                ) : (
                                    <p className="text-red-500">{usuario.Intentos}</p>
                                )}
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`font-bold ${
                                        usuario.NotaFinalCurso >= 11
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {usuario.NotaFinalCurso}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={() => {
                                                setUsuarioEdit(usuario);
                                                setNotaEdit(usuario.NotaFinalCurso);
                                            }}
                                        >
                                            <FilePenLine className="h-5 w-5"/>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Editar Nota</DialogTitle>
                                            <DialogDescription>
                                                Actualiza la nota para {usuario.NombreUsuario}.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                className="w-full border rounded p-2"
                                                value={notaEdit ?? ""}
                                                onChange={(e) =>
                                                    setNotaEdit(parseFloat(e.target.value))
                                                }
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                variant="outline"
                                                onClick={() => setModalOpen(false)}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button onClick={ actualizarNota}>Actualizar</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};
