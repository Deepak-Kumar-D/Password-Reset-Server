import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/userRouter.js";
import { passRouter } from "./routes/passwordRouter.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const url = process.env.MONGODB_URL || "mongodb://localhost/passwordreset";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const con = mongoose.connection;
con.on("open", () => console.log("MongoDB is also connected!"));

var corsOptions = { origin: true, credentials: true };

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the password reset app!");
});

app.use("/", router);
app.use("/", passRouter);

app.listen(PORT, () => {
  console.log(`Server connected @ ${PORT}...`);
});
