import mongoose from "mongoose";

const HomeBanner = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    subTitle:{
        type:String,
        required:false
    },
    altTag:{
        type:String,
        required:false
    },
    bannerVideo:{
        type:String,
        required:true
    },
    videoPoster:{
        type:String,
        required:true
    },
    index:{
        type:Number,
        required:false
    }
})

export default mongoose.models.HomeBanner || mongoose.model('HomeBanner',HomeBanner)