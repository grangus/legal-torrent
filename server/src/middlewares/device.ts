import { RequestHandler } from "express";
import { Language } from "../misc/translations";
import UAParser from "ua-parser-js";

export const device: RequestHandler = (req, res, next) => {
  let language = new Language(req.session.language || "en");

  if (!req.headers["user-agent"])
    return res.status(401).json({
      status: "error",
      error: language.getTranslation("unauthorized"),
    });

  let parser = new UAParser(req.headers["user-agent"]);

  let browser = parser.getBrowser();
  let os = parser.getOS();

  req.session.device = {
    browser: {
      name: browser.name || "Unknown browser",
      version: browser.version || "Unknown version",
    },
    os: {
      name: os.name || "Unknown OS",
      version: os.version || "Unknown OS version",
    },
    userAgent: req.headers["user-agent"],
  };

  next();
};
