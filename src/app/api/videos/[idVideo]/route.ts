import { NextRequest, NextResponse } from "next/server";
import { Conex } from "@/util/conexion";
import sql from "mssql";
export async function POST(request: NextRequest,{ params }: { params: Promise<{ idVideo: string }> }
) {
    const idVideo= (await params).idVideo;
    const conx = await Conex();
    const {idUsuario, idCurso, siguienteVideo} = await request.json();
    if( siguienteVideo){
        const result = await conx.request()
        .input("idUsuario", sql.Int(),idUsuario)
        .input("idVideo", sql.Int(),idVideo)
        .input("idCurso", sql.Int(),idCurso)
        .execute("ActualizarSiguienteVideo")
        return NextResponse.json(result.recordset);
    }
    const result = await conx.request()
        .input("idUsuario", sql.Int(),idUsuario)
        .input("idVideo", sql.Int(),idVideo)
        .input("idCurso", sql.Int(),idCurso)
        .execute("IdVideo")
    return NextResponse.json(result.recordset);
}






