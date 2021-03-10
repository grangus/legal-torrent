import { Router } from "express";
import authRouter from "./auth.route";

declare module "express-session" {
  interface SessionData {
    user: User;
    language?: string;
  }
}

interface User {
  uid: number;
  email: string;
}

const routes = Router();

routes.use("/api/v1", authRouter);

export default routes;
