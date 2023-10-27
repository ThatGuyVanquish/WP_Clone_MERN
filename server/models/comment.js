import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    content: { type: String, required: true, max: 400 },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    postID: { type: Schema.Types.ObjectId, ref: "Post"},
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
