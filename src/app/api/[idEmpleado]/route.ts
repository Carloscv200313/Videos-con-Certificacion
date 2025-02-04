import { NextRequest, NextResponse } from "next/server";
import { Conex } from "@/util/conexion";
import sql from "mssql";
export async function GET(request: NextRequest,{ params }: { params: Promise<{ idEmpleado: string }> }
) {
    const idEmpleado= (await params).idEmpleado;
    const conx = await Conex();
    const result = await conx.request()
        .input("idUsuario", sql.Int(),idEmpleado)
        .execute("cursosAlumnos")
    return NextResponse.json(result.recordset);
}

export async function PUT(request: NextRequest,{ params }: { params: Promise<{ idEmpleado: string }> }
) {
    const idEmpleado= (await params).idEmpleado;
    const {PrimerVideoId,CursoId} = await request.json();
    const conx = await Conex();
    const result = await conx.request()
        .input("idUsuario", sql.Int(),idEmpleado)
        .input("idPrimerVideo", sql.Int(),PrimerVideoId)
        .input("idCurso", sql.Int(),CursoId)
        .execute("ActivarCurso")
    return NextResponse.json(result);
}

export async function POST(request: NextRequest,{ params }: { params: Promise<{ idEmpleado: string }> }
) {
    const idEmpleado= (await params).idEmpleado;
    const {idCurso} = await request.json();
    const conx = await Conex();
    const result = await conx.request()
        .input("idUsuario", sql.Int(),idEmpleado)
        .input("idCurso", sql.Int(),idCurso)
        .execute("CursoProgreso")
    const curso = result.recordset[0]
    return NextResponse.json(curso);
}