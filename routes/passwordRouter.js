import express from "express";
import { User } from "../models/userModel.js";
import { Token } from "../models/tokenModel.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const passRouter = express.Router();

// Forgot Password
passRouter.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({ error: "Email-Id is required!" });
  }

  try {
    const isExist = await User.findOne({ email: email });

    if (!isExist) {
      return res.status(422).json({ error: "Email-Id doesn't exist!" });
    }

    let token = jwt.sign({ _id: isExist._id }, process.env.SECRET_KEY);

    const newToken = new Token({ userId: isExist._id, token: token });
    newToken.save();

    const sendMail = () => {
      let Transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      let mailOptions = {
        from: '"Password Reset App"' + "<" + process.env.MAIL_USERNAME + ">",
        to: email,
        subject: "Password Reset",
        html: `<p>Hi User,</p>\n
          <h3>Click <a href="http://localhost:3000/resetpassword/${token}">here</a> to reset your password.</h3>\n
          <p style="margin: 0;">Regards,</p>\n
          <p style="margin: 0;">Password Reset App</p>`,
      };

      Transport.sendMail(mailOptions, function (error, response) {
        if (error) {
          response.send(error);
        } else {
          response.send("Password reset mail sent!");
        }
      });
    };
    sendMail();

    res.status(201).json({ message: "Email sent for password reset!" });
  } catch (err) {
    res.send(err);
  }
});

// Reset password
passRouter.post("/resetpassword/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const verifyToken = await Token.findOne({ token: token });

  if (verifyToken) {
    const user = await User.findById({ _id: verifyToken.userId });

    user.password = password;
    await user.save();
    await verifyToken.delete();

    res.status(201).json({ message: "Password reset success!" });
  } else {
    res.status(422).json({ error: "Invalid attempt" });
  }
});

export { passRouter };
