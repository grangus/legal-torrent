//User settings, info, reputation, notifications, etc will go here.
import { Router } from "express";

const userRouter = Router();

userRouter.get("/users/me", async (req, res) => {});

export default userRouter;
