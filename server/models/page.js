import mongoose from "mongoose";
const { Schema } = mongoose;

const pageSchema = new Schema(
  {
    page: {
      type: String,
      required: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    titleImage: {
      type: Schema.Types.ObjectId,
      ref: "Media",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Page", pageSchema);
