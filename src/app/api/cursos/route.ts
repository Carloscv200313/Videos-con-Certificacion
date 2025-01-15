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
