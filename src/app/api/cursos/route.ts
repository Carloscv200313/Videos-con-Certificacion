import { NextRequest, NextResponse } from "next/server";
import { Conex } from "@/util/conexion";
import sql from "mssql";
export async function POST(req: NextRequest) {
    const conx = await Conex();
    const {id} = await req.json();
    const result = await conx.request()
        .input("AlumnoId", sql.Int(),id)
        .execute("CursoAlumnoID")
    return NextResponse.json(result.recordset);
}
