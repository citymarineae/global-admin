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
    }
})

export default mongoose.models.HomeAbout || mongoose.model('HomeAbout',HomeAboutSchema)