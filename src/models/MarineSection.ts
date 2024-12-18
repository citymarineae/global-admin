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
  bannerVideo: {
    type: String,
    required: true
  },
  bannerImage: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  metaDataTitle: {
    type: String,
    required: false
  },
  metaDataDesc: {
    type: String,
    required: false
  },
  altTag: {
    type: String,
    required: false
  },
  altTagBanner: {
    type: String,
    required: false
  },
  index:{
    type:Number,
    required:false
  }
});

export default mongoose.models.MarineSection || mongoose.model("MarineSection", MarineSectionSchema);
