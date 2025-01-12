import { NextRequest, NextResponse } from "next/server";
import { Conex } from "@/util/conexion";
import sql from "mssql";
export async function POST(req: NextRequest) {
    const conx = await Conex();
    const {idUsuario, idCurso} = await req.json();
    const result = await conx.request()
        .input("idUsuario", sql.Int(),idUsuario)
        .input("idCurso", sql.Int(),idCurso)
        .execute("ObtenerVideos")
    return NextResponse.json(result.recordset);
}
