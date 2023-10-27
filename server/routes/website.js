import express from "express";
import { requireSignin, isAdmin } from "../middlewares";
import { getNumbers, createPage, getPage } from "../controllers/website";
const router = express.Router();

router.get("/numbers/:id?", getNumbers);
router.post("/page", requireSignin, isAdmin, createPage);
router.get("/page/:page", getPage);

export default router;
