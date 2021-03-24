//All of the endpoints for things regarding torrents will go here.
import { Router, Request } from "express";
import { Language } from "../misc/translations";
import { PrismaClient } from "@prisma/client";
import joi from "joi";
import parseTorrent from "parse-torrent";
import multer from "multer";
import bytes from "bytes";
import { Client, RequestParams, ApiResponse } from "@elastic/elasticsearch";
import tmdb from "node-themoviedb";
import { RedisMethods } from "../misc/redis";

interface MulterError {} //so typescript doesnt rage at me

interface TorrentSearchResult {
  name: string;
  description: string;
  category: string;
  downloads: number;
  seeders: number;
  leechers: number;
}

interface Hit {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: TorrentSearchResult;
}

const torrentRouter = Router();
const prisma = new PrismaClient();
const redis = new RedisMethods();
const client = new Client({ node: "http://localhost:9200" });
const mdb = new tmdb(process.env.TMDB_KEY || "");

torrentRouter.get("/torrents/exclusive", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    let exclusive = await redis.getExclusiveTorrents();

    res.status(200).json({
      status: "success",
      data: {
        exclusive,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

torrentRouter.get("/torrents/top/:time", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    const { error } = joi
      .object({
        period: joi
          .string()
          .required()
          .valid("all", "month", "week", "day")
          .label("Time period"),
      })
      .validate(req.query);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    if (!req.query.period) return;

    let top = redis.getTop(req.query.period);

    res.status(200).json({
      status: "success",
      data: {
        top,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

torrentRouter.get("/torrents/moviesearch", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    const { error } = joi
      .object({
        query: joi.string().required().label("Search query"),
      })
      .validate(req.query);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    if (!req.query.query) return;

    let searchResults = await mdb.search.movies({
      query: {
        query: req.query.query,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        movies: searchResults.data.results.slice(0, 5).map((m) => {
          const { id, poster_path, overview, title } = m;
          return { id, poster_path, overview, title };
        }),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

torrentRouter.get("/torrents/search/:page", async (req: Request, res) => {
  const language = new Language(req.session.language || "en");

  try {
    const { error } = joi
      .object({
        query: joi.string().required().label("Search query"),
        category: joi
          .string()
          .valid("Movie", "Audio", "App", "Game", "Book", "Adult", "Misc"),
        sortBy: joi.string().valid("downloads", "leechers", "seeders"),
      })
      .validate(req.query);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    let page = isNaN(parseInt(req.params.page)) ? 0 : parseInt(req.params.page);

    let filter = [];
    let sort: any = ["_score"];

    if (req.query?.category) {
      filter.push({
        term: {
          category: String(req.query?.category).toLowerCase(),
        },
      });
    }

    if (req.query?.sortBy) {
      sort.push({
        [req.query.sortBy]: "desc",
      });
    }

    let query: RequestParams.Search = {
      index: "torrents",
      body: {
        sort: sort,
        from: page <= 0 ? 0 : page * 10,
        size: 50,
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: req.query?.query,
                  fields: ["name", "description"],
                },
              },
            ],
            filter: filter,
          },
        },
      },
    };

    let result: ApiResponse = await client.search(query);

    let mapped = result.body.hits.hits.map((h: Hit) => {
      const {
        name,
        description,
        category,
        downloads,
        leechers,
        seeders,
      } = h._source;
      return {
        name,
        description,
        category,
        downloads,
        leechers,
        seeders,
        id: h._id,
      };
    });

    let pages = Math.ceil(result.body.hits.total.value / 50);

    res.status(200).json({
      status: "success",
      data: {
        pages,
        results: result.body.hits.total.value,
        torrents: mapped,
      },
    });
  } catch (error) {
    console.dir(error, { depth: null });
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

//TODO: write a custom torrent parsing/generation library to handle this. parse-torrent is absolute dogshit
torrentRouter.get("/torrents/:id/download", async (req, res) => {
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
      },
    });

    if (!torrent)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("torrent_not_found"),
      });

    if (torrent.status !== "AVAILABLE")
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("torrent_not_available"),
      });

    await prisma.torrent.update({
      where: {
        id: req.params.id,
      },
      data: {
        download_count: { increment: 1 },
      },
    });

    let fileBuffer = Buffer.from(torrent.b64torrent, "base64");

    res.set("Content-Type", "application/x-bittorrent");
    res.set(
      "Content-Disposition",
      `attachment; filename="${torrent.name}.torrent"`
    );

    res.status(200).send(fileBuffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

torrentRouter.post("/torrents/edit", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    if (!req.session.user)
      return res.status(403).json({
        status: "error",
        error: language.getTranslation("unauthorized"),
      });

    let domains: Set<string> = new Set();

    domains.add("image.tmdb.org"); //TODO: add image serving subdomain

    const { error } = joi
      .object({
        id: joi.string().uuid().required(),
        name: joi.string().required(),
        description: joi.string().required(),
        category: joi
          .string()
          .required()
          .valid("Movie", "Audio", "App", "Game", "Book", "Adult", "Misc"),
        image: joi.string().uri({
          scheme: "https",
          domain: { tlds: { allow: domains }, minDomainSegments: 3 },
        }),
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
      where: { id: req.body.id, userId: req.session.user.id },
    });

    if (!torrent)
      return res.status(400).json({
        status: "error",
        error: language.getTranslation("invalid_torrent"),
      });

    await prisma.torrent.update({
      where: { id: req.body.id },
      data: {
        description: req.body.description,
        name: req.body.name,
        category: req.body.category,
      },
    });

    await client.update({
      index: "torrents",
      id: torrent.elasticId,
      body: {
        name: req.body.name,
        description: req.body.description,
      },
    });

    await client.indices.refresh({ index: "torrents" });

    res.status(200).json({
      status: "success",
      data: {
        message: language.getTranslation("torrent_updated"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

torrentRouter.get("/torrents/:id/info", async (req, res) => {
  const language = new Language(req.session.language || "en");

  try {
    let { error } = joi.string().required().validate(req.params.id);

    if (error) {
      let { type, context } = error.details[0];

      return res.status(400).json({
        status: "error",
        error: language.getJoiTranslation(type, context),
      });
    }

    let torrent = await prisma.torrent.findFirst({
      where: {
        OR: [{ id: req.params.id }, { elasticId: req.params.id }],
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
      id,
      comments,
      description,
      favorites,
      category,
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
          id,
          name,
          status,
          category,
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
    console.error(error);
    res.status(500).json({
      status: "error",
      error: language.getTranslation("internal_error"),
    });
  }
});

torrentRouter.post("/torrents/upload", async (req: Request, res) => {
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

      let result: ApiResponse = await client.index({
        index: "torrents",
        body: {
          name: torrentInfo.name,
          description: "No description provided!",
          category: "Misc",
          downloads: 0,
          seeders: 0,
          leechers: 0,
        },
      });

      await client.indices.refresh({ index: "torrents" });

      let torrent = await prisma.torrent.create({
        data: {
          name: torrentInfo.name,
          size: size,
          status:
            req.session.user?.role == "UPLOADER" ? "AVAILABLE" : "UNCONFIRMED",
          elasticId: result.body._id,
          b64torrent: Buffer.from(req.file.buffer).toString("base64"),
          user: {
            connect: { id: req.session.user?.id },
          },
          xbt_torrent: { create: { info_hash: torrentInfo.infoHash } },
        },
      });

      let user = await prisma.user.findFirst({
        where: { id: req.session.user?.id },
        include: { subscribers: true },
      });

      if (!user) return;

      let userIds = user.subscribers.map((s) => {
        return s.id;
      });

      req.wss?.uploadNotification(userIds, {
        title: language.getTranslation("new_sub_upload"),
        message: torrentInfo.name,
      });

      let operations = user.subscribers.map((s) => {
        return prisma.notification.create({
          data: {
            title: language.getTranslation("new_sub_upload"),
            message: torrentInfo.name,
            user: { connect: { id: s.id } },
          },
        });
      });

      await prisma.$transaction(operations);

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
