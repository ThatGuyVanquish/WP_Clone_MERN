import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { DATABASE, PORT } from "./config";

import authRoutes from "./routes/auth";
import categoryRoutes from "./routes/category";
import postRoutes from "./routes/posts";
import contactRoutes from "./routes/contact";
import websiteRoutes from "./routes/website";
const morgan = require("morgan");

const app = express();

// db connection
mongoose.set("strictQuery", false); // required for version 6
mongoose
  .connect(DATABASE)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB CONNECTION ERROR: ", err));

// middlewares
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// route middlewares
app.use("/api", authRoutes, categoryRoutes, postRoutes, contactRoutes, websiteRoutes);

const port = PORT || 8000;

app.listen(port, () => console.log(`Server running on port ${port}`));
