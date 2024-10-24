import mongoose from "mongoose";

const ContactUsSchema = new mongoose.Schema({
    phone:{
        type:String,
        required:true
    },
    fax:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    map:{
        type:String,
        required:true
    }
})

export default mongoose.models.ContactUs || mongoose.model('ContactUs',ContactUsSchema)