import mongoose from "mongoose";

const HomeAboutSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    metaDataTitle:{
        type:String,
        required:false
    },
    metaDataDesc:{
        type:String,
        required:false
    },
    altTag:{
        type:String,
        required:false
    }
})

export default mongoose.models.HomeAbout || mongoose.model('HomeAbout',HomeAboutSchema)