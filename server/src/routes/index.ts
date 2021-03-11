import { Router } from "express";
import authRouter from "./auth.route";
import staffRouter from "./staff.route";
import userRouter from "./user.route";
import torrentRouter from "./torrents.route";

declare module "express-session" {
  interface SessionData {
    user: User;
    language?: string;
  }
}

interface User {
  id: number;
  email: string;
  role: string;
}

const routes = Router();

routes.use("/api/v1", authRouter);
routes.use("/api/v1", staffRouter);
routes.use("/api/v1", userRouter);
routes.use("/api/v1", torrentRouter);

export default routes;
