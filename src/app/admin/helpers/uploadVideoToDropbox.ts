
import { uploadToDropbox } from "@/lib/connectDropbox";

export const uploadVideoToDropBox = async(bannerVideo:File,sectionName?:string) =>{
    try {
        
        let bannerVideoPath = "";
        let bannerVideoDropboxPath = "";
        const bannerVideoName = `${Date.now()}-${bannerVideo.name || "bannerVideo"}`
        bannerVideoDropboxPath = sectionName ? sectionName+"/" + bannerVideoName : `/marineSectionBannerVideo/${bannerVideoName}`;
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