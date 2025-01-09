import { NextRequest, NextResponse } from "next/server";
import { Conex } from "@/util/conexion";
import sql from "mssql";
export async function POST(req: NextRequest) {
    const conx = await Conex();
    const {idUsuario, idCurso} = await req.json();
    const result = await conx.request()
        .input("UsuarioId", sql.Int(),idUsuario)
        .input("CursoId", sql.Int(),idCurso)
        .execute("ObtenerVideosPorCursoConProgreso")
    return NextResponse.json(result.recordset);
}
