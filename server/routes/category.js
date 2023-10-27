import express from "express";
import { requireSignin, isAdmin } from "../middlewares";

const router = express.Router();

// controllers
import {
  createCategory,
  editCategory,
  deleteCategory,
  getAllCategories,
  getCategoryName,
} from "../controllers/category";

router.post("/category", requireSignin, isAdmin, createCategory); // CREATE
router.get("/categories", getAllCategories); // RECEIVE
router.get("/category-name/:slug", getCategoryName);
router.put(`/category/:slug`, requireSignin, isAdmin, editCategory); // UPDATE
router.delete(`/category/:slug`, requireSignin, isAdmin, deleteCategory); // DELETE

export default router;
