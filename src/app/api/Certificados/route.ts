import { NextRequest, NextResponse } from "next/server";
import { Conex } from "@/util/conexion";
import sql from "mssql";
export async function GET() {
    const conx = await Conex();
    const result = await conx.request()
        .query("SELECT id AS CursoId, nombre AS NombreCurso, descripcion AS DescripcionCurso FROM Cursos")
    return NextResponse.json(result.recordset);
}
export async function POST(request: NextRequest) {
    try {
        const { IdAlumno } = await request.json();
        const conx = await Conex();
        console.log('IdAlumno recibido:', IdAlumno);
        const result = await conx.request()
            .input("IdAlumno", sql.Int(), IdAlumno)
            .execute("ObtenerDatosProcesos");
        return NextResponse.json(result.recordset);
    } catch (err) {
        console.error('Error en la API:', err);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { idUsuario, idCurso, intentos } = await request.json();
        const conx = await Conex();
        console.log('CursoId recibido:', idCurso);
        if (intentos) {
            const result = await conx.request()
                .input("IdCurso", sql.Int(), idCurso)
                .input("IdAlumno", sql.Int(), idUsuario)
                .execute("ObtenerYActualizarProcesos");
            return NextResponse.json(result.recordset);
        }
        const result = await conx.request()
            .input("idCurso", sql.Int(), idCurso)
            .input("idUsuario", sql.Int(), idUsuario)
            .execute("CambiarEstado");
        return NextResponse.json(result.recordset);
    } catch (err) {
        console.error('Error en la API:', err);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
