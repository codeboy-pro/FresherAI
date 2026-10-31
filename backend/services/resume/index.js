import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import resumeRouter from "./routes/resume.route.js";


dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8003;

app.get("/", (req, res) => {
  res.send("Hello from resume service");
});
app.use("/",resumeRouter);

app.listen(PORT, () => {
  console.log(`Resume service is running on port ${PORT}`);
  connectDB();
});
