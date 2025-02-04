import { NextRequest, NextResponse } from "next/server";
import { Conex } from "@/util/conexion";
import sql from "mssql";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
    const conx = await Conex();
    const { correo, contrasena } = await req.json();
    
    console.log(correo, contrasena);
    
    const result = await conx.request()
        .input("correo", sql.VarChar, correo)
        .input("contrasena", sql.VarChar, contrasena)
        .execute("Validar_usuario");

    if (!result.recordset[0].mensaje) {
        const { id, rol } = result.recordset[0];

        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, 
                id,
                rol
            },
            rol 
        );
        // Serializar la cookie con opciones de seguridad
        const serialized = serialize("mytoken", token, {
            httpOnly: true, 
            //secure: true, // 🔥 Necesario para HTTPS
            //sameSite: "none", // 🔥 Necesario si el frontend está en otro dominio
            path: "/", 
            maxAge: 60 * 60 * 24, // 1 día
            //domain: ".cursos-expertiss.vercel.app"
        });

        const response = NextResponse.json({ rol, id });
        
        response.headers.set("Set-Cookie", serialized);

        console.log("✅ Credenciales validadas, cookie establecida.");
        return response;
    }

    return NextResponse.json({ message: "Usuario no existe" });
}
