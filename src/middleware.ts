import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const cookie = request.cookies.get('mytoken');
    if (request.nextUrl.pathname.includes('/Empleado')) {
        if (cookie==undefined) {
            return NextResponse.redirect(new URL("/", request.url))
        }
        try {
            const { payload } = await jwtVerify(cookie.value, new TextEncoder().encode('empleado'))
            console.log(payload)
            const id = payload.id;
            console.log(id)
            if (!id) {
                // Si no se encuentra el idEmpleado, redirige al inicio
                return NextResponse.redirect(new URL("/", request.url));
            }
            // Obtener el ID de la URL solicitada
            const pathParts = request.nextUrl.pathname.split('/');
            const idRuta = parseInt(pathParts[2], 10); // Última parte de la ruta

            if (idRuta !== id) {
                // Si el ID en la URL no coincide con el del token, redirige al inicio
                return NextResponse.redirect(new URL("/", request.url));
            }
            return NextResponse.next();
        } catch (error) {
            console.log(error)
            return NextResponse.redirect(new URL("/", request.url))
        }
    }    
    if (request.nextUrl.pathname.includes('/Gerente')) {
        if (cookie==undefined) {
            return NextResponse.redirect(new URL("/", request.url))
        }
        try {
            const { payload } = await jwtVerify(cookie.value, new TextEncoder().encode('gerente'))
            console.log(payload)
            return NextResponse.next()
        } catch (error) {
            console.log(error)
            return NextResponse.redirect(new URL("/", request.url))
        }
    }
}