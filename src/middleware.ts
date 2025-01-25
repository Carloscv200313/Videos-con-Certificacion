import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Orígenes permitidos (incluyendo localhost para desarrollo)
const allowedOrigins = ['https://cursos-expertiss.vercel.app', 'http://localhost:3000'];

const corsOptions = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true', // Necesario para manejar cookies
};

export async function middleware(request: NextRequest) {
    const origin = request.headers.get('origin') ?? '';
    const isAllowedOrigin = allowedOrigins.includes(origin);

    // Manejar solicitudes preflight (OPTIONS)
    const isPreflight = request.method === 'OPTIONS';
    if (isPreflight) {
        const preflightHeaders = {
            ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
            ...corsOptions,
        };
        return NextResponse.json({}, { headers: preflightHeaders });
    }

    // Aquí manejamos las rutas protegidas para empleados y gerentes
    const cookie = request.cookies.get('mytoken');

    if (request.nextUrl.pathname.includes('/Empleado')) {
        if (cookie == undefined) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        try {
            const { payload } = await jwtVerify(cookie.value, new TextEncoder().encode('empleado'));
            const id = payload.id;
            if (!id) {
                return NextResponse.redirect(new URL("/", request.url));
            }
            const pathParts = request.nextUrl.pathname.split('/');
            const idRuta = parseInt(pathParts[2], 10);

            if (idRuta !== id) {
                return NextResponse.redirect(new URL("/", request.url));
            }
            const response = NextResponse.next();
            // Agregar cabeceras CORS a la respuesta
            if (isAllowedOrigin) {
                response.headers.set('Access-Control-Allow-Origin', origin);
            }
            Object.entries(corsOptions).forEach(([key, value]) => {
                response.headers.set(key, value);
            });
            return response;
        } catch (error) {
            console.log(error);
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    if (request.nextUrl.pathname.includes('/Gerente')) {
        if (cookie == undefined) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        try {
            await jwtVerify(cookie.value, new TextEncoder().encode('gerente'));
            const response = NextResponse.next();
            // Agregar cabeceras CORS a la respuesta
            if (isAllowedOrigin) {
                response.headers.set('Access-Control-Allow-Origin', origin);
            }
            Object.entries(corsOptions).forEach(([key, value]) => {
                response.headers.set(key, value);
            });
            return response;
        } catch (error) {
            console.log(error);
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Asegúrate de aplicar las cabeceras CORS en todas las rutas (no solo las protegidas)
    const response = NextResponse.next();
    if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin);
    }
    Object.entries(corsOptions).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    return response;
}

export const config = {
    matcher: '/api/:path*', // Aplica middleware a las rutas de la API
};
