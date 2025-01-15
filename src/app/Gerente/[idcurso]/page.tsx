import { TablaCursos } from "@/components/TablaCursos"

export default async function Page({
    params,
}: {
    params: Promise<{ idcurso: string }>
}) {
    const { idcurso } = await params
    return (
        <div className="min-h-screen bg-[#1d1238] py-10 px-10 ">
            <TablaCursos CursoId={idcurso} />
        </div>
    )
}