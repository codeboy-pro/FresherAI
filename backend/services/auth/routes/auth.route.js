import express from "express";
import { GoogleAuth, logout, useCoins } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login",GoogleAuth);
authRouter.get("/logout", logout);


authRouter.post("/user-coins",useCoins);


export default authRouter;