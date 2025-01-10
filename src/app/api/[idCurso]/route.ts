import { NextRequest, NextResponse } from "next/server";
import { Conex } from "@/util/conexion";
import sql from "mssql";
export async function GET(request: NextRequest,{ params }: { params: Promise<{ idCurso: string }> }
) {
    const video= (await params).idCurso;
    const conx = await Conex();
    const result = await conx.request()
        .input("AlumnoId", sql.Int(),video)
        .execute("CursoAlumnoID")
    return NextResponse.json(result.recordset);
}
