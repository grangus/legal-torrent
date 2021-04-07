//Endpoints for login and registration.
//TODO: implement sentry.io or some other error logging library
import { Router } from "express";
import * as argon2 from "argon2";
import joi from "joi";
import { Language } from "../misc/translations";
import { PrismaClient } from "@prisma/client";
import { RedisMethods } from "../misc/redis";

const authRouter = Router();
const prisma = new PrismaClient();
const redis = new RedisMethods();

authRouter.get("/auth/token", (req, res) => {
  res.header({ "x-csrf-token": req.csrfToken() }).json({
    status: "success",
  });
});

authRouter.post("/auth/register", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    const { error } = joi
      .object({
        username: joi.string().alphanum().allow("_", "-").required(),
        email: joi.string().email().required(),
        password: joi.string().min(16).required(),
        gender: joi
          .string()
          .valid("Female", "Male", "Other", "Unspecified")
          .default("Unspecified"),
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
      where: { email: req.body.email, OR: { username: req.body.username } },
    });

    if (userExists) {
      let error =
        userExists.email == req.body.email &&
        userExists.username == req.body.username
          ? language.getTranslation("username_and_email_taken")
          : userExists.email == req.body.email
          ? language.getTranslation("email_taken")
          : language.getTranslation("username_taken");

      return res.status(400).json({
        status: "error",
        error,
      });
    }

    let hashedPassword = await argon2.hash(req.body.password);

    let user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        gender: req.body.gender,
        settings: { create: {} },
      },
    });

    let { email, id, role, profileImage, username } = user;

    req.session.user = {
      email,
      id,
      role,
    };

    await redis.addUserSession(id, req.sessionID);

    res.status(200).json({
      status: "success",
      data: {
        email,
        id,
        role,
        profileImage,
        username,
      },
    });
  } catch (error) {
    console.log(error);
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

    let { email, id, role, banned, ban_reason, profileImage, username } = user;

    if (banned)
      return res.status(403).json({
        status: "error",
        error: ban_reason,
      });

    req.session.user = {
      email,
      id,
      role,
    };

    await redis.addUserSession(id, req.sessionID);

    res.status(200).json({
      status: "success",
      data: {
        email,
        id,
        role,
        profileImage,
        username,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

authRouter.post("/auth/logout", async (req, res) => {
  const language = new Language(req.session.language || "en");

  if (!req.session.user)
    return res.status(403).json({
      status: "error",
      error: language.getTranslation("unauthorized"),
    });

  req.session.destroy((err) => {
    if (err)
      return res.status(500).json({
        status: "error",
        error: language.getTranslation("internal_error"),
      });

    res.status(200).json({
      status: "success",
      data: {
        message: "Logged out successfully!",
      },
    });
  });
});

authRouter.post("/auth/session/destroy/:sid", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        message: language.getTranslation("unauthorized"),
      });

    await redis.removeAllUserSessions(req.session.user.id);

    res.status(200).json({
      status: "success",
      data: {
        message: language.getTranslation("session_destroyed"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

authRouter.post("/auth/sessions/clear", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    await redis.removeAllUserSessions(req.session.user.id);

    res.status(200).json({
      status: "success",
      data: {
        message: language.getTranslation("session_clear_success"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

authRouter.get("/auth/sessions", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    let sessions = (await redis.getAllUserSessions(req.session.user.id)).map(
      (s) => {
        return {
          device: s.device,
          user: s.user,
        };
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        sessions,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

export default authRouter;
