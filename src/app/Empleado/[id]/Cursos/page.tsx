import { Carts } from "@/components/Carts"


export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return (
        <div className="min-h-screen bg-[#1d1238] text-white py-5 ">
            <Carts idEmpleado={id} />
        </div>
    )
}