"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Curso {
    IdAlumno: string;
    IdCurso: number;
    ProgresoCurso: number;
    ExamenHabilitado: boolean;
    NotaFinal: number;
    CantidadIntentos: number;
    EnlaceExamen: string;
    NombreCurso: string;
}

interface Props {
    IdAlumno: string;
}

export default function TablaCursos({ IdAlumno }: Props) {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(null);

    useEffect(() => {
        const obtenerCursos = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Certificados`, {
                method: "POST",
                body: JSON.stringify({ IdAlumno }),
                credentials: "include", // Incluye las cookies en la solicitud
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setCursos(data);
                });
        };
        obtenerCursos();
    }, [IdAlumno]);

    const manejarAbrirModal = (curso: Curso) => {
        setCursoSeleccionado(curso);
        setModalVisible(true);
    };

    const manejarCerrarModal = () => {
        setCursoSeleccionado(null);
        setModalVisible(false);
    };

    const manejarAceptarExamen = async () => {
        if (cursoSeleccionado) {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/Certificados`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ idUsuario: IdAlumno, idCurso: cursoSeleccionado.IdCurso, intentos: true }),
            });
            const resultado = await resp.json();
            console.log(resultado);

            // Abre la ruta del examen en otra pestaña
            window.open(cursoSeleccionado.EnlaceExamen, "_blank", "noopener,noreferrer");

            // Actualiza los cursos y cierra el modal
            setCursos((prevCursos) =>
                prevCursos.map((curso) =>
                    curso.IdCurso === cursoSeleccionado.IdCurso
                        ? { ...curso, CantidadIntentos: curso.CantidadIntentos + 1, ExamenHabilitado: false }
                        : curso
                )
            );
            manejarCerrarModal();
        }
    };

    return (
        <>
            {/* Modal */}
            {modalVisible && (
                <Dialog open={modalVisible} onOpenChange={manejarCerrarModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Advertencia</DialogTitle>
                        </DialogHeader>
                        <p>
                            Si realiza este examen, se consumirá un intento. Solo dispone de un máximo de 3 intentos por curso.
                            ¿Desea continuar?
                        </p>
                        <DialogFooter>
                            <Button variant="secondary" onClick={manejarCerrarModal}>
                                Cancelar
                            </Button>
                            <Button onClick={manejarAceptarExamen}>Aceptar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Tabla de cursos */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Curso</TableHead>
                        <TableHead>Intentos</TableHead>
                        <TableHead>Nota</TableHead>
                        <TableHead>Examen</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Certificado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cursos.map((curso, key) => (
                        <TableRow key={key} className={curso.ExamenHabilitado?"bg-green-800":"bg-red-800"}>
                            <TableCell>{curso.NombreCurso}</TableCell>
                            <TableCell>{curso.CantidadIntentos}</TableCell>
                            <TableCell>{curso.NotaFinal}</TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => manejarAbrirModal(curso)}
                                    disabled={!curso.ExamenHabilitado}
                                >
                                    Ir al examen
                                </Button>
                            </TableCell>
                            <TableCell>
                                {curso.ExamenHabilitado ? "Dar examen" : "Esperando"}
                            </TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => console.log(`Descargando certificado para el curso ${curso.IdCurso}`)}
                                    disabled={curso.NotaFinal <= 15}
                                >
                                    Descargar Certificado
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
