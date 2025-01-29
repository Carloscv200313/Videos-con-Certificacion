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
        .execute("Validar_usuario")

    if (!result.recordset[0].mensaje) {
        const { id, rol, } = result.recordset[0]
        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 minuto de expiración
                id,
                rol
            },
            rol // Clave secreta para firmar el token
        );

        // Serializar la cookie
        const serialized = serialize("mytoken", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            path: "/",
            sameSite: "none",  // ✅ Permite cookies entre dominios
            secure: true       // ✅ Requiere HTTPS (obligatorio para SameSite=None)
        });

        // Crear una respuesta con la cookie en las cabeceras
        const response = NextResponse.json({ rol, id });
        response.headers.set("Set-Cookie", serialized);
        response.headers.set("Access-Control-Allow-Origin", "https://cursos-expertiss.vercel.app");
        response.headers.set("Access-Control-Allow-Credentials", "true"); // ✅ Permite enviar cookies en fetch
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return response;

    }

    return NextResponse.json({ message: "Usuario no existe" });
}
