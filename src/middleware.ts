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
            return NextResponse.next()
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