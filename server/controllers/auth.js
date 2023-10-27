import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import nanoid from "nanoid";
import {
  SENDGRID_KEY,
  EMAIL_FROM,
  JWT_SECRET,
  POSTS_PER_PAGE,
} from "../config";

// sendgrid
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(SENDGRID_KEY);

export const signup = async (req, res) => {
  try {
    // validation
    const { username, email, name, password, phone } = req.body;
    if (!username) {
      return res.json({ error: "Username is required" });
    }
    if (!phone) {
      return res.json({ error: "Phone is required" });
    }
    if (!email) {
      return res.json({ error: "Email is required" });
    }
    if (!name) {
      return res.json({ error: "Name is required" });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }
    const exist = await User.findOne({
      $or: [{ email: email }, { slug: slugify(username) }],
    });
    if (exist) {
      return res.json({
        error: "Email or username (or both) are taken",
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);

    try {
      const user = await new User({
        username,
        slug: slugify(username),
        email,
        name,
        password: hashedPassword,
        phone,
      }).save();

      console.log(`"user has been saved: ${user}`);
      // create signed token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      const { password, ...rest } = user._doc;
      return res.json({
        token,
        user: rest,
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    // check if our db has user with that username
    const user = await User.findOne({ slug: slugify(username) });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong password",
      });
    }
    // create signed token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;
    user.secret = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const forgotPassword = async (req, res) => {
  const { username } = req.body;
  // find user by email
  const user = await User.findOne({ slug: slugify(username) });
  console.log("USER ===> ", user);
  if (!user) {
    return res.json({ error: "User not found" });
  }
  // generate code
  const resetCode = nanoid(5).toUpperCase();
  // save to db
  user.resetCode = resetCode;
  user.save();
  // prepare email
  const emailData = {
    from: EMAIL_FROM,
    to: user.email,
    subject: "Password reset code",
    html: `<h1>Your password  reset code is: ${resetCode}</h1>`,
  };
  // send email
  try {
    const data = await sgMail.send(emailData);
    console.log(data);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.json({ ok: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, resetCode } = req.body;
    // find user based on email and resetCode
    const user = await User.findOne({ email, resetCode });
    // if user not found
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }
    // if password is short
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetCode = "";
    user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const getCurrentRole = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const user = await User.findById(id);
      return res.json({ role: user.role });
    }
    const user = await User.findById(req.auth._id);
    return res.json({ role: user.role });
  } catch (err) {
    console.error(err.message);
    return res.json({ error: "Couldn't find user" });
  }
};

export const createUser = async (req, res) => {
  try {
    // validation
    const { username, email, name, password, phone, role, notify } = req.body;
    if (!username) {
      return res.json({ error: "Username is required" });
    }
    if (!phone) {
      return res.json({
        error: "Phone is required",
      });
    }
    if (!email) {
      return res.json({
        error: "Email is required",
      });
    }
    if (!name) {
      return res.json({ error: "Name is required" });
    }
    const validEmail = (email) =>
      email.indexOf("@") != -1 &&
      (email.match(/@/g) || []).length === 1 &&
      email.endsWith(".com");
    if (!validEmail(email)) {
      return res.json({ error: "Invalid email address" });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }
    const exist = await User.findOne({
      $or: [{ email: email }, { slug: slugify(username) }],
    });
    if (exist) {
      return res.json({
        error: "Email or username (or both) are taken",
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);
    const unHashedPassword = password;
    try {
      const user = await new User({
        username,
        slug: slugify(username),
        email,
        name,
        password: hashedPassword,
        phone,
        role,
      }).save();

      // create signed token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      if (notify) {
        const emailData = {
          from: EMAIL_FROM,
          to: user.email,
          subject: "Account details",
          html: `<h1>Here are the details for your account:
          <br/>Email: ${email}
          <br/>Password: ${unHashedPassword}
          <br/>Role: ${role}
          <br/>Please reset your password before you log in for the first time.</h1>`,
        };
        // send email
        try {
          const data = await sgMail.send(emailData);
          console.log(data);
        } catch (err) {
          console.log(err);
        }
      }
      const { password, ...rest } = user._doc;
      return res.json({
        token,
        user: rest,
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

export const getUsers = async (req, res) => {
  const perPage = POSTS_PER_PAGE;
  const { page } = req.params || 1;
  try {
    const users = await User.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .select("-password -secret -resetCode -updatedAt -createdAt -__v")
      .populate("image", "url")
      .sort({ email: 1 });
    res.json(users);
  } catch (err) {
    console.log(err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    // Remove the 'author' property from all of the posts that the user posted.
    const posts = await Post.updateMany(
      { _id: { $in: user.posts } },
      { $unset: { author: 1 } } // Use $unset to remove the 'author' field
    );

    // Remove the 'author' property from all of the comments that the user posted.
    const comments = await Comment.updateMany(
      { author: user._id },
      { $unset: { author: 1 } }
    ).exec();

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.slug }).populate(
      "image"
    );
    res.json(user);
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { email, phone, password, image } = req.body;
    let params = { email, phone, image };
    if (password) {
      if (password.length < 6) {
        res.json({ error: "Password is too short" });
        return;
      } else if (password.length > 12) {
        res.json({ error: "Password is too long" });
        return;
      }
      params = { ...params, password: await hashPassword(password) };
    }
    if (req.body.role) params = { ...params, role: req.body.role };
    const user = await User.findOneAndUpdate(
      { slug: req.params.slug },
      params,
      {
        new: true,
      }
    ).populate("image", "url");
    return res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const getUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    return res.json(userCount);
  } catch (err) {
    console.error(err);
    return res.json({ error: err });
  }
};

// export const getUsername = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findById(id).select(" username ");
//     return res.json(user.username);
//   } catch (err) {
//     console.error(err.message);
//     return res.json({ error: err });
//   }
// };

export const getUsername = async (req, res) => {
  const { slug } = req.params;
  try {
    const user = await User.findOne({ slug }).select("_id username ");
    return res.json({ id: user._id, username: user.username });
  } catch (err) {
    console.error(err.message);
    return res.json({ error: err });
  }
};
