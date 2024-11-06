import mongoose from "mongoose";

const MarineSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subTitle: {
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
  bannerVideo:{
    type:String,
    required:true
  },
  bannerImage:{
    type:String,
    required:true
  },
  slug:{
    type:String,
    required:true
  }
});

export default mongoose.models.MarineSection || mongoose.model("MarineSection", MarineSectionSchema);
