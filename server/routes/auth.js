import express from "express";

const router = express.Router();

// middleware
import {
  requireSignin,
  isAdmin,
  isAuthor,
  isSubscriber,
} from "../middlewares/index";

// controllers
const {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  getCurrentRole,
  createUser,
  getUsers,
  getUsername,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  getUserCount,
} = require("../controllers/auth");

router.post("/signup", signup);
router.post("/create-user", requireSignin, isAdmin, createUser);
router.get("/users/:page?", requireSignin, isAdmin, getUsers);
router.get("/user/:slug", requireSignin, getUserProfile);
router.get("/username/:slug", getUsername);
router.get("/user-count", requireSignin, isAdmin, getUserCount);
router.delete("/users/:id", requireSignin, isAdmin, deleteUser);
router.put("/user/:slug", requireSignin, updateUserProfile);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/current-admin", requireSignin, isAdmin, (req, res) =>
  res.json({ ok: true })
);
router.get("/current-author", requireSignin, isAuthor, (req, res) =>
  res.json({ ok: true })
);

router.get("/current-subscriber", requireSignin, isSubscriber, (req, res) =>
  res.json({ ok: true })
);

router.get("/user-role/:id?", requireSignin, getCurrentRole);

export default router;
