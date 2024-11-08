import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
    pageHeading:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    contentHeading:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    metaDataTitle:{
        type:String,
        required:false
    },
    metaDataDesc:{
        type:String,
        required:false
    }
})

export default mongoose.models.About || mongoose.model('About',AboutSchema)