import mongoose from "mongoose";

const PortsAndTerminalsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  contentOne: {
    type: String,
    required: true,
  },
  contentTwo: {
    type: String,
    required: true,
  },
  imageOne: {
    type: String,
    required: false,
  },
  imageTwo: {
    type: String,
    required: false,
  },
  metaDataTitle:{
    type:String,
    required:false
  },
  metaDataDesc:{
    type:String,
    required:false
  },
  altTagImageOne:{
    type:String,
    required:false
  },
  altTagImageTwo:{
    type:String,
    required:false
  }
  
});

export default mongoose.models.PortsAndTerminals || mongoose.model("PortsAndTerminals", PortsAndTerminalsSchema);
