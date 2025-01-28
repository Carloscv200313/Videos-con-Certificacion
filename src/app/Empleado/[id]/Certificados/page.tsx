import TablaCursos from "@/components/TablaExamen"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return (
        <div className="min-h-screen bg-[#1d1238] text-white p-5 ">
            <TablaCursos IdAlumno={id} />
        </div>
    )
}