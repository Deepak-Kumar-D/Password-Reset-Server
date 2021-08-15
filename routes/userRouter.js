import express from "express";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Registering a new user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please fill all the fields!" });
  }

  try {
    const isExist = await User.findOne({ email: email });

    if (isExist) {
      return res.status(422).json({ error: "Email-Id already exists!" });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: "User account created!" });
  } catch (err) {
    res.send(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please fill all the fields!" });
  }

  try {
    const isExist = await User.findOne({ email: email });

    if (!isExist) {
      return res.status(422).json({ error: "Email-Id doesn't exist!" });
    } else {
      const isMatch = await bcrypt.compare(password, isExist.password);

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials!" });
      } else {
        res.status(200).json({ message: "Login Successful!" });
      }
    }
  } catch (err) {
    res.send(err);
  }
});

//Logout
router.get("/logout", (req, res) => {
  res.status(200).json({ message: "Logged Out Successfully" });
});

export { router };
