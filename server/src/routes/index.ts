import { Router } from "express";
import authRouter from "./auth.route";

const routes = Router();

routes.use("/api/v1", authRouter);

export default routes;
