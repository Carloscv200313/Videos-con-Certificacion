import { NextRequest, NextResponse } from "next/server";
import { Conex } from "@/util/conexion";
import sql from "mssql";
export async function GET() {
    const conx = await Conex();
    const result = await conx.request()
    .query("SELECT id AS CursoId, nombre AS NombreCurso FROM Cursos")
    return NextResponse.json(result.recordset);
}
export async function POST(request: NextRequest) {
    try {
        const { CursoId } = await request.json();
        const conx = await Conex();
        console.log('CursoId recibido:', CursoId);
        const result = await conx.request()
            .input("CursoId", sql.Int(), CursoId)
            .execute("ObtenerProgresoCurso");
        return NextResponse.json(result.recordset);
    } catch (err) {
        console.error('Error en la API:', err);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}



export async function PUT(request: NextRequest) {
    try {
        // Parsear los datos del cuerpo de la solicitud
        const { IdAlumno, IdCurso, nota } = await request.json();

        // Validar que se recibieron todos los parámetros necesarios
        if (!IdAlumno || !IdCurso || nota === undefined) {
            return NextResponse.json({ error: 'Parámetros incompletos' }, { status: 400 });
        }

        // Establecer conexión a la base de datos
        const conx = await Conex();

        // Llamar al procedimiento almacenado
        const result = await conx.request()
            .input("IdAlumno", sql.Int(), IdAlumno)
            .input("IdCurso", sql.Int(), IdCurso)
            .input("nota", sql.Int(), nota)
            .execute("IngresarNotas");

        // Devolver los datos obtenidos del procedimiento almacenado
        return NextResponse.json(result.recordset);
    } catch (err) {
        console.error('Error en la API:', err);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

