import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  brief: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  slug:{
    type:String,
    required:true
  },
  createdDate: {
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

export default mongoose.models.News || mongoose.model("News", NewsSchema);
