import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  slug:{
    type:String,
    required:true
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

export default mongoose.models.Team || mongoose.model("Team", TeamSchema);
