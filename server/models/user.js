import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: false,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: false,
      required: true,
      unique: false,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      default: "Subscriber",
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "Media",
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    resetCode: "",
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
