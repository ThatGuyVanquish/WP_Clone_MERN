import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    featuredImage: { type: Schema.Types.ObjectId, ref: "Media" },
    content: {},
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    author: { type: Schema.Types.ObjectId, ref: "User" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
