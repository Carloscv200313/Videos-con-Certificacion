//import HeroVideoDialog from "@/components/ui/hero-video-dialog"

import DefaultVideoProgressPlayer from "@/components/VideoProgressPlayer";
export default async function Page({
    params,
}: {
    params: Promise<{ id: string, video: string, cursos: string }>
}) {
    const { id, video, cursos } = await params
    return (
        <div className="min-h-screen bg-gray-200 py-5 ">
            <DefaultVideoProgressPlayer idVideo={video} idUsuario={id} idCurso={cursos} />
            {/*<HeroVideoDialog
            className="dark:hidden block"
            animationStyle="from-center"
            videoSrc={`/${video}.mp4`}
            thumbnailSrc="/12.jpg"
            thumbnailAlt="Hero Video"
            />*/}
        </div>
    )
}