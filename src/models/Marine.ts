import mongoose from "mongoose";

const MarineSchema = new mongoose.Schema({
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
  }
});

export default mongoose.models.Marine || mongoose.model("Marine", MarineSchema);
