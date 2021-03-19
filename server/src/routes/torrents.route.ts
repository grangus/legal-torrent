//All of the endpoints for things regarding torrents will go here.
import { Router } from "express";
import { Language } from "../misc/translations";
import { PrismaClient } from "@prisma/client";
import joi from "joi";
import parseTorrent from "parse-torrent";
import multer from "multer";
import bytes from "bytes";

interface MulterError {}
//couldnt use this interface - its just here for reference - parse-torrent types are so fucking dogshit

// interface TorrentInfo {
//   info: {
//     length: 301045,
//     name: string,
//     'piece length': 16384,
//     pieces: string
//   },
//   infoBuffer: string,
//   name: string,
//   announce: string[],
//   infoHash: string,
//   infoHashBuffer: string,
//   created: Date,
//   createdBy: string,
//   urlList: string[],
//   files: [
//     {
//       path: string,
//       name: string,
//       length: number,
//       offset: number
//     }
//   ],
//   length: number,
//   pieceLength: number,
//   lastPieceLength: number,
//   pieces: string[]
// }

const torrentRouter = Router();
const prisma = new PrismaClient();

torrentRouter.get("/torrents/:id/info", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    let { error } = joi.string().uuid().required().validate(req.params.id);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    let torrent = await prisma.torrent.findFirst({
      where: {
        id: req.params.id,
      },
      include: {
        xbt_torrent: true,
        comments: { take: 10 },
        favorites: true,
        downloads: true,
      },
    });

    if (!torrent)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("torrent_not_found"),
      });

    let {
      comments,
      description,
      favorites,
      downloads,
      negative_ratings,
      positive_ratings,
      status,
      size,
      xbt_torrent,
      name,
    } = torrent;

    res.status(200).json({
      status: "success",
      data: {
        torrent: {
          name,
          status,
          size,
          negative_ratings,
          positive_ratings,
          description,
          seeders: xbt_torrent?.seeders,
          leechers: xbt_torrent?.leechers,
        },
        comments,
        favorites: favorites.length,
        downloads: downloads.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

torrentRouter.post("/torrents/upload", async (req, res) => {
  const language = new Language(req.session.language || "en");

  if (!req.session.user)
    return res.status(403).json({
      status: "error",
      error: language.getTranslation("unauthorized"),
    });

  const memoryStorage = multer.memoryStorage();

  const upload = multer({
    storage: memoryStorage,
    fileFilter: (req, file, callback) => {
      if (file.mimetype !== "application/x-bittorrent")
        return callback(new Error("BitTorrent files only!"));

      callback(null, true);
    },
    limits: { fileSize: 1000000 },
  }).single("torrent");

  upload(req, res, async (err: MulterError) => {
    if (err)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("invalid_file"),
      });

    try {
      if (!req.file)
        return res.status(400).json({
          status: "error",
          error: language.getTranslation("invalid_file"),
        });

      const torrentInfo: any = parseTorrent(req.file.buffer); //i dont like "any" but i have no choice because of crap types

      let size = bytes(torrentInfo.info.length, { unitSeparator: " " })
        ? bytes(torrentInfo.info.length, { unitSeparator: " " })
        : "Unknown Size";

      let torrent = await prisma.torrent.create({
        data: {
          name: torrentInfo.name,
          size: size,
          user: {
            connect: { id: req.session.user?.id },
          },
          xbt_torrent: { create: { info_hash: torrentInfo.infoHash } },
        },
      });

      res.status(200).json({
        status: "success",
        data: {
          message: "uploaded",
          id: torrent.id,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: language.getTranslation("internal_error"),
      });
    }
  });
});

torrentRouter.post("/torrent/rate", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        type: joi.valid("POSITIVE", "NEGATIVE", "UNRATE"),
        torrentId: joi.string().uuid().required(),
      })
      .validate(req.body);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    let rated = await prisma.rating.findFirst({
      where: { torrentId: req.body.torrentId },
    });

    if (req.body.type !== "unrate") {
      const createRating = prisma.rating.create({
        data: {
          type: req.body.type,
          user: { connect: { id: req.session.user.id } },
          torrent: { connect: { id: req.body.torrentId } },
        },
      });

      const updateTorrentCount =
        req.body.type == "POSITIVE"
          ? prisma.torrent.update({
              where: { id: req.body.torrentId },
              data: { positive_ratings: { increment: 1 } },
            })
          : prisma.torrent.update({
              where: { id: req.body.torrentId },
              data: { negative_ratings: { increment: 1 } },
            });

      await prisma.$transaction([createRating, updateTorrentCount]);

      return res.status(200).json({
        status: "success",
        data: {
          message: language.getTranslation("rated_torrent_successfully"),
        },
      });
    }

    if (rated) {
      const deleteRating = prisma.rating.delete({
        where: { id: req.body.torrentId },
      });

      const updateTorrentCount =
        rated.type == "POSITIVE"
          ? prisma.torrent.update({
              where: { id: req.body.torrentId },
              data: { positive_ratings: { decrement: 1 } },
            })
          : prisma.torrent.update({
              where: { id: req.body.torrentId },
              data: { negative_ratings: { decrement: 1 } },
            });

      await prisma.$transaction([deleteRating, updateTorrentCount]);

      return res.status(200).json({
        status: "success",
        data: {
          message: language.getTranslation("unrated_torrent_successfully"),
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

torrentRouter.post("/torrent/comment/post", async (req, res) => {
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
        comment: joi.string().required(),
        replyTo: joi.string().uuid(),
      })
      .validate(req.body);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    let comment = req.body.replyTo
      ? await prisma.comment.create({
          data: {
            comment: req.body.comment,
            user: { connect: { id: req.session.user.id } },
            torrent: { connect: { id: req.body.torrentId } },
            repliesTo: { connect: { id: req.body.replyTo } },
          },
        })
      : await prisma.comment.create({
          data: {
            comment: req.body.comment,
            user: { connect: { id: req.session.user.id } },
            torrent: { connect: { id: req.body.torrentId } },
          },
        });

    res.status(200).json({
      status: "success",
      data: {
        comment,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

torrentRouter.post("/torrent/comment/edit", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        commentId: joi.string().uuid().required(),
        comment: joi.string().required(),
      })
      .validate(req.body);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    let comment = await prisma.comment.findFirst({
      where: { id: req.body.commentId },
    });

    if (!comment)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("invalid_comment_id"),
      });

    await prisma.comment.update({
      where: {
        id: req.body.commentId,
      },
      data: {
        comment: req.body.comment,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        message: language.getTranslation("comment_updated_successfully"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

torrentRouter.post("/torrent/comment/delete", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    const { error } = joi
      .object({
        commentId: joi.string().uuid().required(),
      })
      .validate(req.body);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    let comment = await prisma.comment.findFirst({
      where: { id: req.body.commentId },
    });

    if (!comment)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("invalid_comment_id"),
      });

    await prisma.comment.delete({
      where: {
        id: req.body.commentId,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        message: language.getTranslation("comment_deleted_successfully"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

torrentRouter.post("/torrent/report", async (req, res) => {
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

    let torrent = await prisma.torrent.findFirst({
      where: { id: req.body.id },
    });

    if (!torrent)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("invalid_torrent"),
      });

    await prisma.torrentReport.create({
      data: {
        reason: req.body.reason,
        torrent: { connect: { id: req.body.id } },
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

export default torrentRouter;
