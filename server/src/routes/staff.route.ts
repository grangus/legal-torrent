//Staff/Admin endpoints will go in here.
import { Router, Request } from "express";
import { Language } from "../misc/translations";
import { PrismaClient } from "@prisma/client";
import joi from "joi";

const staffRouter = Router();
const prisma = new PrismaClient();

//TODO: implement audit log

staffRouter.get("/torrents/reports/list/:page", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    if (!["ADMIN", "VALIDATOR", "MODERATOR"].includes(req.session.user.role))
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    let page = isNaN(parseInt(req.params.page)) ? 0 : parseInt(req.params.page);

    let reports = await prisma.torrentReport.findMany({
      skip: page <= 0 ? 0 : page * 10,
      take: 25,
    });

    res.status(200).json({
      status: "success",
      data: {
        reports,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

staffRouter.post("/torrents/reports/delete", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    if (!["ADMIN", "VALIDATOR", "MODERATOR"].includes(req.session.user.role))
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        id: joi.string().required(),
      })
      .validate(req.body);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    await prisma.torrentReport.delete({
      where: {
        id: req.body.id,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        message: language.getTranslation("report_deleted"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

staffRouter.get("/torrents/unconfirmed/list/:page", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    if (!["ADMIN", "VALIDATOR", "MODERATOR"].includes(req.session.user.role))
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    let page = isNaN(parseInt(req.params.page)) ? 0 : parseInt(req.params.page);

    let torrents = await prisma.torrent.findMany({
      skip: page <= 0 ? 0 : page * 10,
      take: 25,
      where: {
        status: "UNCONFIRMED",
      },
    });

    let mapped = torrents.map((t) => {
      return {
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category,
        size: t.size,
      };
    });

    res.status(200).json({
      status: "success",
      data: {
        torrents: mapped,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

staffRouter.post("/torrents/confirm", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    if (!["ADMIN", "VALIDATOR", "MODERATOR"].includes(req.session.user.role))
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        id: joi.string().required(),
      })
      .validate(req.body);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    await prisma.torrent.update({
      where: {
        id: req.body.id,
      },
      data: {
        status: "AVAILABLE",
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        message: language.getTranslation("torrent_confirmed"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

staffRouter.post("/torrents/block", async (req: Request, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    if (!["ADMIN", "VALIDATOR", "MODERATOR"].includes(req.session.user.role))
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        id: joi.string().required(),
        message: joi.string().required(),
      })
      .validate(req.body);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    let torrent = await prisma.torrent.findFirst({
      where: {
        id: req.body.id,
      },
    });

    if (!torrent)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("invalid_torrent"),
      });

    await prisma.torrent.update({
      where: {
        id: req.body.id,
      },
      data: {
        status: "BLOCKED",
      },
    });

    req.wss?.sendNotification(torrent?.userId, {
      message: req.body.message,
      title: language.getTranslation("user_torrent_blocked"),
    });

    res.status(200).json({
      status: "success",
      data: {
        message: language.getTranslation("torrent_blocked"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

staffRouter.post("/user/ban/toggle", async (req: Request, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    if (!["ADMIN", "MODERATOR"].includes(req.session.user.role))
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        id: joi.number().integer().required(),
        reason: joi.string().required(),
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
      where: {
        id: req.body.id,
      },
    });

    if (!user)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("invalid_user"),
      });

    await prisma.user.update({
      where: {
        id: req.body.id,
      },
      data: {
        banned: !user.banned,
        ban_reason: req.body.reason,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        message: !user.banned
          ? language.getTranslation("user_banned")
          : language.getTranslation("user_unbanned"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

staffRouter.post("/user/edit", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    if (!["ADMIN", "MODERATOR"].includes(req.session.user.role))
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        id: joi.number().integer().required(),
        update: joi
          .object({
            email: joi.string().email().required(),
            username: joi.string().required(),
            password: joi.string().required(),
            bio: joi.string().required(),
            location: joi.string().required(),
            gender: joi
              .string()
              .allow("Male", "Female", "Other", "Unspecified")
              .required(),
          })
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

    let user = await prisma.user.findFirst({
      where: {
        id: req.body.id,
      },
    });

    if (!user)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("invalid_user"),
      });

    let { username, email, password, bio, location, gender } = req.body.update;

    await prisma.user.update({
      where: {
        id: req.body.id,
      },
      data: { username, email, password, bio, location, gender },
    });

    res.status(200).json({
      status: "success",
      data: {
        message: language.getTranslation("user_updated_successfully"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

staffRouter.get("/users/reports/:page", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    if (!["ADMIN", "MODERATOR"].includes(req.session.user.role))
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    let page = isNaN(parseInt(req.params.page)) ? 0 : parseInt(req.params.page);

    let reports = await prisma.userReport.findMany({
      skip: page <= 0 ? 0 : page * 10,
      take: 25,
    });

    res.status(200).json({
      status: "success",
      data: {
        reports,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

staffRouter.post("/user/reports/delete", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    if (!["ADMIN", "MODERATOR"].includes(req.session.user.role))
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        id: joi.string().required(),
      })
      .validate(req.body);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    await prisma.userReport.delete({
      where: {
        id: req.body.id,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        message: language.getTranslation("report_deleted"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

export default staffRouter;
