//import HeroVideoDialog from "@/components/ui/hero-video-dialog"
import DefaultVideoProgressPlayer from "@/components/VideoProgressPlayer";
export default async function Page(){
    return (
        <div className="min-h-screen bg-gray-200 py-5 ">
            <DefaultVideoProgressPlayer video="1" />
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