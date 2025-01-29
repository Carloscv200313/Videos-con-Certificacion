import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const allowedOrigins = [
    'https://cursos-expertiss.vercel.app',
    'https://85t36tnq-3000.brs.devtunnels.ms',
    'http://localhost:3000' // Reemplaza con tu URL de túnel actual
];

export async function middleware(request: NextRequest) {
    console.log(request.nextUrl.pathname)
    const origin = request.headers.get('origin') ?? '';
    const isAllowedOrigin = allowedOrigins.includes(origin);
    console.log(origin)
    console.log(request.method)
    // 🔹 Manejo de CORS para solicitudes OPTIONS
    if (request.method === 'OPTIONS') {
        const headers = new Headers({
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
        });

        if (isAllowedOrigin) {
            headers.set('Access-Control-Allow-Origin', origin);
        }

        return new NextResponse(null, { headers });
    }

    // 🔹 Verificar autenticación en rutas protegidas
    const cookie = request.cookies.get('mytoken');
    console.log(cookie);
    console.log(request.nextUrl.pathname)
    if (request.nextUrl.pathname.startsWith('/Empleado')) {
        console.log("Entro EMPLADO")
        if (!cookie) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        try {
            const { payload } = await jwtVerify(cookie.value, new TextEncoder().encode('empleado'));
            const id = payload.id;

            if (!id) {
                return NextResponse.redirect(new URL("/", request.url));
            }

            // Verificar que el ID en la ruta coincide con el del token
            const pathParts = request.nextUrl.pathname.split('/');
            const idRuta = parseInt(pathParts[2], 10);

            if (idRuta !== id) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        } catch (error) {
            console.log(error);
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    if (request.nextUrl.pathname.startsWith('/Gerente')) {
        if (!cookie) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        try {
            await jwtVerify(cookie.value, new TextEncoder().encode('gerente'));
        } catch (error) {
            console.log(error);
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // 🔹 Configuración de CORS en la respuesta final
    const response = NextResponse.next();
    if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return response;
}

// 🔹 Aplicar el middleware solo a las rutas necesarias
