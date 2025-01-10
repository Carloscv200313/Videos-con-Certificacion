import { Sidebar } from "@/components/sidebar";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};
export default async function CursosLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ cursos: string, id: string }>
}) {
    const { cursos, id } = await params
    return (
        <div className="flex md:flex-row flex-col md:h-screen">
            <Sidebar idUsuario= {id} idCurso={cursos} />
            <div className="overflow-y-auto w-full">{children}</div>
        </div>
    )
}