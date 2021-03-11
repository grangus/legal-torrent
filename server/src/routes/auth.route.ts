//Endpoints for login and registration.
//TODO: implement sentry.io or some other error logging library
import { Router } from "express";
import * as argon2 from "argon2";
import joi from "joi";
import { Language } from "../misc/translations";
import { PrismaClient } from "@prisma/client";
import { Redis } from "../misc/redis";

const authRouter = Router();
const prisma = new PrismaClient();
const redis = new Redis();

//This endpoint does nothing. I just have it here for testing things. Ignore it.
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

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

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

    let { email, id, role } = user;

    req.session.user = {
      email,
      id,
      role,
    };

    await redis.addUserSession(id, req.sessionID);

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

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

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

    let { email, id, role } = user;

    req.session.user = {
      email,
      id,
      role,
    };

    await redis.addUserSession(id, req.sessionID);

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
