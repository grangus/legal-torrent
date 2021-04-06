//User settings, info, reputation, notifications, etc will go here.
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { Language } from "../misc/translations";
import joi from "joi";
import multer from "multer";
import { existsSync, readdirSync } from "fs";
import { resolve } from "path";

interface MulterError {}

const userRouter = Router();
const prisma = new PrismaClient();

//TODO: add a notification deletion api

userRouter.get("/user/:id/info", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.params.id || isNaN(parseInt(req.params.id)))
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("invalid_user"),
      });

    let user = await prisma.user.findFirst({
      where: { id: parseInt(req.params.id) },
      include: { settings: true, subscribers: true, torrents: true },
    });

    if (!user)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("invalid_user"),
      });

    let {
      username,
      banned,
      gender,
      id,
      profileImage,
      bio,
      location,
      reputation,
      subscribers,
      torrents
    } = user;

    res.status(200).json({
      status: "success",
      data: {
        user: {
          username,
          banned,
          gender,
          id,
          profileImage,
          bio,
          location,
          reputation,
          subscribers: subscribers.length,
          uploads: torrents.length
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

userRouter.get("/user/:id/avatar", async (req, res) => {
  const language = new Language(req.session.language || "en");

  const { error } = joi.number().integer().validate(req.params.id);

  if (error) {
    let { type, context } = error.details[0];

    return res.status(400).json({
      status: "error",
      error: language.getJoiTranslation(type, context),
    });
  }

  let avatarExists = existsSync(`./uploads/avatars/${req.params.id}`);

  if (avatarExists) {
    res
      .status(200)
      .sendFile(
        resolve(
          `./uploads/avatars/${req.params.id}/${readdirSync(
            `./uploads/avatars/${req.params.id}`
          ).pop()}`
        )
      );
  } else {
    //send default avatar?
  }
});

userRouter.post("/user/avatar/update", async (req, res) => {
  const language = new Language(req.session.language || "en");

  if (!req.session.user)
    return res.status(403).json({
      status: "error",
      error: language.getTranslation("unauthorized"),
    });

  const diskStorage = multer.diskStorage({
    destination: `./uploads/avatars/${req.session.user.id}`,
    filename: (req, file, callback) => {
      callback(
        null,
        `${req.session.user?.id}.${file.originalname.split(".").pop()}`
      );
    },
  });

  const upload = multer({
    storage: diskStorage,
    fileFilter: (req, file, callback) => {
      if (!["image/jpeg", "image/png"].includes(file.mimetype))
        return callback(new Error("PNG/JPEG files only!"));

      callback(null, true);
    },
    limits: { fileSize: 1000000 },
  }).single("avatar");

  try {
    upload(req, res, async (err: MulterError) => {
      if (err)
        return res.status(400).json({
          status: "error",
          error: language.getTranslation("invalid_file"),
        });

      if (!req.file)
        return res.status(400).json({
          status: "error",
          error: language.getTranslation("invalid_file"),
        });

      res.status(200).json({
        status: "success",
        data: {
          message: language.getTranslation("uploaded_successfully"),
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

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
  console.log(req.headers)
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    let user = await prisma.user.findFirst({
      where: { email: req.session.user.email },
      include: { settings: true },
    });

    if (!user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    let { email, banned, gender, id, role, settings } = user;

    res.status(200).json({
      status: "success",
      data: {
        user: { email, banned, gender, id, role, settings },
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

userRouter.post("/user/profile/update", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        bio: joi.string().required(),
        gender: joi.string().allow("Male", "Female", "Unspecified", "Other"),
        location: joi.string().required(),
        username: joi.string().alphanum().allow("_", "-"),
      })
      .validate(req.body);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    await prisma.user.update({
      where: {
        id: req.session.user.id,
      },
      data: {
        bio: req.body.bio,
        gender: req.body.gender,
        location: req.body.location,
        username: req.body.username,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        message: "Updated profile successfully!",
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

userRouter.post("/user/settings/update", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        hide_last_online: joi.boolean().required(),
        disable_adult: joi.boolean().required(),
        disable_torrent_history: joi.boolean().required(),
      })
      .validate(req.body);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    await prisma.userSettings.update({
      where: { id: req.session.user.id },
      data: {
        disable_adult: req.body.disable_adult,
        disable_torrent_history: req.body.disable_torrent_history,
        hide_last_online: req.body.hide_last_online,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        message: "Updated settings successfully!",
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

//maybe this endpoint would be better off in torrents.route.ts
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

    let user = await prisma.user.findFirst({
      where: { id: req.body.id },
    });

    if (!user)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("invalid_user"),
      });

    await prisma.userReport.create({
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
