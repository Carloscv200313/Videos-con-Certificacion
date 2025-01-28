import type { Metadata } from "next";
import { SidebarPrincipal } from '../../components/SidebarPrincipal';
export const metadata: Metadata = {
    title: "Cursos",
    description: "Generated by create next app",
};
export default async function CursosLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex md:flex-row flex-col md:h-screen">
            <SidebarPrincipal/>
            <div className="overflow-y-auto w-full">{children}</div>
        </div>
    )
}