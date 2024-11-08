
import { uploadToDropbox } from "@/lib/connectDropbox";

export const uploadVideoToDropBox = async(bannerVideo:File) =>{
    try {
        
        let bannerVideoPath = "";
        const bannerVideoName = `${Date.now()}-${bannerVideo.name || "bannerVideo"}`
        const bannerVideoDropboxPath = `/marineSectionBannerVideo/${bannerVideoName}`;
        bannerVideoPath = await uploadToDropbox(bannerVideo,bannerVideoDropboxPath);
        console.log("Banner video uploaded to Dropbox:", bannerVideoDropboxPath);
        if(bannerVideoPath){
            return bannerVideoPath
        }

        return false
    
    } catch (error) {
        console.log("Error uploading video:",error)
        return false
    }
}