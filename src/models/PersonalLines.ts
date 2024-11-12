import mongoose from "mongoose";

const PersonalLinesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
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
  
});

export default mongoose.models.PersonalLines || mongoose.model("PersonalLines", PersonalLinesSchema);
