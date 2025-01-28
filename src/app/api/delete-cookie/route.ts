import { NextResponse } from "next/server";
import { serialize } from "cookie";

export const POST = async () => {
    const response = NextResponse.json({ message: "Cookie eliminada" });
    response.headers.set(
        "Set-Cookie",
        serialize("mytoken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(0),
        })
    );

    return response;
};
