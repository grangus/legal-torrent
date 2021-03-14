//User settings, info, reputation, notifications, etc will go here.
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { Language } from "../misc/translations";
import joi from "joi";

const userRouter = Router();
const prisma = new PrismaClient();

userRouter.get("/user/lang/set/:code", async (req, res) => {
  if (!["en", "es", "fr"].includes(req.params.code))
    return res.status(400).json({
      status: "error",
      error: "Invalid language supplied!",
    });

  req.session.language = req.params.code;

  res.status(200).json({
    status: "success",
  });
});

userRouter.get("/user/me", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    let user = await prisma.user.findFirst({
      where: { email: req.session.user.email },
    });

    if (!user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    let { email, banned, gender, id, role } = user;

    res.status(200).json({
      status: "success",
      data: {
        user: { email, banned, gender, id, role },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

userRouter.get("/user/notifications/:type", async (req, res) => {
  const language = new Language(req.session.language || "en");
  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    if (!["all", "unread"].includes(req.params.type))
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("invalid_type_provided"),
      });

    let query =
      req.params.type == "all"
        ? { userId: req.session.user.id }
        : { userId: req.session.user.id, read: false };

    let notifications = await prisma.notification.findMany({
      where: query,
    });

    res.status(200).json({
      status: "success",
      data: {
        notifications,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

userRouter.get("/user/favorites/list/:page", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    let page = isNaN(parseInt(req.params.page)) ? 0 : parseInt(req.params.page);

    let favorites = await prisma.favorite.findMany({
      where: {
        userId: req.session.user.id,
      },
      include: { torrent: true },
      skip: page <= 0 ? 0 : page * 10,
      take: 10,
    });

    res.status(200).json({
      status: "success",
      data: {
        favorites,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

userRouter.get("/user/downloads/history/:page", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    let page = isNaN(parseInt(req.params.page)) ? 0 : parseInt(req.params.page);

    let downloads = await prisma.download.findMany({
      where: {
        userId: req.session.user.id,
      },
      include: { torrent: true },
      skip: page <= 0 ? 0 : page * 10,
      take: 10,
    });

    res.status(200).json({
      status: "success",
      data: {
        downloads,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

userRouter.post("/user/profile/update", async (req, res) => {});

userRouter.post("/user/favorites/toggle", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        torrentId: joi.string().uuid().required(),
        toggle: joi.boolean().required(),
      })
      .validate(req.body);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    let favorited = await prisma.favorite.findFirst({
      where: {
        torrentId: req.body.torrentId,
      },
    });

    if (req.body.toggle && !favorited) {
      await prisma.favorite.create({
        data: {
          torrent: { connect: { id: req.body.torrentId } },
          user: { connect: { id: req.session.user.id } },
        },
      });

      return res.status(200).json({
        status: "success",
        data: {
          message: language.getTranslation("favorited_successfully"),
        },
      });
    }

    if (!req.body.toggle && favorited) {
      await prisma.favorite.delete({
        where: {
          id: req.body.torrentId,
        },
      });

      return res.status(200).json({
        status: "success",
        data: {
          message: language.getTranslation("unfavorited_successfully"),
        },
      });
    }

    res.status(400).json({
      status: "error",
      error: language.getTranslation("unknown_error"),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

userRouter.post("/user/message/send", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        title: joi.string().required(),
        message: joi.string().required(),
        id: joi.number().integer().required(),
      })
      .validate(req.body);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    const createInboxMessage = prisma.user.update({
      where: { id: req.body.id },
      data: {
        inbox: {
          create: {
            message: req.body.message,
            title: req.body.title,
            senderId: req.session.user.id,
          },
        },
      },
    });

    const createOutboxMessage = prisma.user.update({
      where: { id: req.session.user.id },
      data: {
        outbox: {
          create: {
            message: req.body.message,
            title: req.body.title,
            receiverId: req.body.id,
          },
        },
      },
    });

    await prisma.$transaction([createInboxMessage, createOutboxMessage]);

    res.status(200).json({
      status: "success",
      data: {
        message: language.getTranslation("message_sent_successfully"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

userRouter.get("/user/messages/:type/:page", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    if (!["inbox", "outbox"].includes(req.params.type))
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("invalid_inbox_type"),
      });

    let page = isNaN(parseInt(req.params.page)) ? 0 : parseInt(req.params.page);

    let messages =
      req.params.type == "inbox"
        ? await prisma.inboundMessage.findMany({
            where: {
              userId: req.session.user.id,
            },
            skip: page <= 0 ? 0 : page * 10,
            take: 10,
          })
        : await prisma.outboundMessage.findMany({
            where: {
              userId: req.session.user.id,
            },
            skip: page <= 0 ? 0 : page * 10,
            take: 10,
          });

    res.status(200).json({
      status: "success",
      data: {
        messages,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

userRouter.post("/user/report", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        reason: joi.string().required().max(500),
        id: joi.number().integer().required(),
      })
      .validate(req.body);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    await prisma.report.create({
      data: {
        reason: req.body.reason,
        user: { connect: { id: req.body.id } },
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        message: language.getTranslation("successfully_reported"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

userRouter.post("/user/subscribe/toggle", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        id: joi.number().integer().required(),
        toggle: joi.boolean().required(),
      })
      .validate(req.body);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    let subscribed = prisma.user.findFirst({
      where: { subscriptions: { some: { id: req.body.id } } },
    });

    if (req.body.toggle && !subscribed) {
      const updateSubscriptions = prisma.user.update({
        where: { id: req.session.user.id },
        data: {
          subscriptions: { connect: { id: req.body.id } },
        },
      });

      const updateSubscribers = prisma.user.update({
        where: { id: req.body.id },
        data: {
          subscribers: { connect: { id: req.session.user.id } },
        },
      });

      await prisma.$transaction([updateSubscriptions, updateSubscribers]);

      return res.status(200).json({
        status: "success",
        data: {
          message: language.getTranslation("subscribed_successfully"),
        },
      });
    }

    if (!req.body.toggle && subscribed) {
      const updateSubscriptions = prisma.user.update({
        where: { id: req.session.user.id },
        data: {
          subscriptions: { delete: { id: req.body.id } },
        },
      });

      const updateSubscribers = prisma.user.update({
        where: { id: req.body.id },
        data: {
          subscribers: { delete: { id: req.session.user.id } },
        },
      });

      await prisma.$transaction([updateSubscriptions, updateSubscribers]);

      return res.status(200).json({
        status: "success",
        data: {
          message: language.getTranslation("unsubscribed_successfully"),
        },
      });
    }

    res.status(400).json({
      status: "error",
      error: language.getTranslation("unknown_error"),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

export default userRouter;
