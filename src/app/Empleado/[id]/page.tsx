import { Carts } from "@/components/Carts"


export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return (
        <div className="min-h-screen bg-gray-200 py-5 ">
            <Carts id={id} />
        </div>
    )
}