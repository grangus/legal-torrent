import { Router } from "express";
import * as argon2 from "argon2";
import joi from "joi";
import { Language } from "../misc/translations";
import { PrismaClient } from "@prisma/client";
import { Redis } from "../misc/redis";

const authRouter = Router();
const prisma = new PrismaClient();
const redis = new Redis();

//TODO: implement sentry.io or some other error logging library
authRouter.get("/auth/meta", (req, res) => {
  res.json({
    status: "success",
  });
});

authRouter.post("/auth/register", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    const { error } = joi
      .object({
        email: joi.string().email().required(),
        password: joi.string().min(16).required(),
        gender: joi
          .string()
          .valid("Female", "Male", "Other", "Unspecified")
          .required(),
      })
      .validate(req.body);

    if (error)
      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(
          error.details[0].type,
          error.details[0].context
        ),
      });

    let userExists = await prisma.user.findFirst({
      where: { email: req.body.email },
    });

    if (userExists)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("user_exists"),
      });

    let hashedPassword = await argon2.hash(req.body.password);

    let user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
      },
    });

    req.session.user = {
      email: user.email,
      uid: user.id,
    };

    await redis.addUserSession(user.id, req.sessionID);

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

authRouter.post("/auth/login", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    const { error } = joi
      .object({
        email: joi.string().email().required(),
        password: joi.string().required(),
      })
      .validate(req.body);

    if (error)
      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(
          error.details[0].type,
          error.details[0].context
        ),
      });

    let user = await prisma.user.findFirst({
      where: { email: req.body.email },
    });

    if (!user)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("invalid_email_or_password"),
      });

    let validPassword = await argon2.verify(user.password, req.body.password);

    if (!validPassword)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("invalid_email_or_password"),
      });

    req.session.user = {
      email: user.email,
      uid: user.id,
    };

    await redis.addUserSession(user.id, req.sessionID);

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

export default authRouter;