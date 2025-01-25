export default async function Page({
    params,
}: {
    params: Promise<{ idEmpleado: string }>
}) {
    const { idEmpleado } = await params
    return (
        <div className="min-h-screen bg-[#1d1238] text-white py-5 ">
            {idEmpleado}
        </div>
    )
}