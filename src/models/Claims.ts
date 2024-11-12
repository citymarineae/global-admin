import mongoose from "mongoose";

const ClaimsShema = new mongoose.Schema({
    pageHeading:{
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
    },
    altTag:{
        type:String,
        required:false
    }
})

export default mongoose.models.Claims || mongoose.model('Claims',ClaimsShema)