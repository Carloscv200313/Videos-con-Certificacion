import { NextRequest, NextResponse } from "next/server";
import { Conex } from "@/util/conexion";
import sql from "mssql";
export async function GET(req: NextRequest,{ params }: { params: Promise<{ video: string  ,  idCurso:string }> }
) {
    const idVideo= (await params).video;
    const idUsuario= (await params).idCurso;
    const conx = await Conex();
    const result = await conx.request()
    .input("idUsuario", sql.Int(),idUsuario)
    .input("idVideo", sql.Int(),idVideo)
        .execute("IDvideo")
    return NextResponse.json(result.recordset);
}


export async function PUT(request: NextRequest,{ params }: { params: Promise<{ video: string  ,  idCurso:string }> }){
    const idVideo= (await params).video;
    const idUsuario= (await params).idCurso;
    const { tiempoVisto} = await request.json();
    const conx = await Conex();
    const result = await conx.request()
    .input("idUsuario", sql.Int, idUsuario)
    .input("idVideo", sql.Int, idVideo)
    .input("tiempoVisto", sql.Decimal(5, 2), tiempoVisto)
    .execute("ActualizarTiempoVisto");
    return NextResponse.json(result);
}


