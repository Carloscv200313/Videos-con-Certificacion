import { NextRequest, NextResponse } from "next/server";
import { Conex } from "@/util/conexion";
import sql from "mssql";
export async function GET(request: NextRequest,{ params }: { params: Promise<{ video: string }> }
) {
    const video= (await params).video;
    const conx = await Conex();
    const result = await conx.request()
        .input("videoID", sql.Int(),video)
        .execute("IDvideo")
    return NextResponse.json(result.recordset);
}
