import mongoose from "mongoose";
const { Schema } = mongoose;

const mediaSchema = new Schema(
  {
    url: String,
    public_id: String,
    uploader: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);
