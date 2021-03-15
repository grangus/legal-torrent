//All of the endpoints for things regarding torrents will go here.
import { Router } from "express";
import { Language } from "../misc/translations";
import { PrismaClient } from "@prisma/client";
import joi from "joi";

const torrentRouter = Router();
const prisma = new PrismaClient();

torrentRouter.get("/torrents/list", async (req, res) => {});

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

torrentRouter.post("/torrent/rate", async (req, res) => {});

torrentRouter.post("/torrent/comment/post", async (req, res) => {});

torrentRouter.post("/torrent/comment/edit", async (req, res) => {});

torrentRouter.post("/torrent/comment/delete", async (req, res) => {});

torrentRouter.post("/torrent/report", async (req, res) => {});

export default torrentRouter;
