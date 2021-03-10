import { Router } from "express";
import * as argon2 from "argon2";
import joi from "joi";
import { Language } from "../misc/translations";

const authRouter = Router();

authRouter.get("/auth/meta", (req, res) => {
  res.json({
    status: "success",
  });
});

authRouter.post("/auth/login", (req, res) => {
  //TODO: implement sessions and check the language
  const language = new Language("en");

  const { error } = joi
    .object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    })
    .validate(req.body);

  if (error)
    return res.json({
      status: "error",
      error: language.getJoiTranslation(error.details[0].type, error.details[0].context),
    });

  console.dir(error, { depth: null });
});

export default authRouter;
