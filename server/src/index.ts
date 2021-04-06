const port = 3001;
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import http from "http";
import routes from "./routes";
import session from "express-session";
import redisSession from "connect-redis";
import ioredis from "ioredis";
import csurf from "csurf";
import { device } from "./middlewares/device";
import WebSocket, { Ws } from "ws";
import { join } from "path";
import Socket from "./misc/socket";
import start from "./misc/cronjobs";
import cors from "cors";

dotenv.config();

interface Error {
  code: string;
}

type Category = "Movie" | "Audio" | "App" | "Game" | "Book" | "Adult" | "Misc";

declare module "ws" {
  interface Ws extends WebSocket {
    id?: number;
  }
}

declare module "express" {
  interface Request {
    wss?: Socket;
  }
}

declare module "qs" {
  type TimePeriod = "all" | "month" | "week" | "day";

  interface ParsedQs {
    sortBy?: string;
    category?: Category;
    query?: string;
    period?: TimePeriod;
  }
}

const app = express();
const staticApp = express();
const server = http.createServer(app);
const Store = redisSession(session);
const redis = new ioredis();

const wss = new WebSocket.Server({
  clientTracking: true,
  noServer: true,
});

console.log(join(__dirname, "./uploads/avatars"));

staticApp.use("/avatars", express.static(join(__dirname, "./uploads/avatars")));

//default avatar sending
staticApp.get("*", (req, res) => {
  res.sendFile(join(__dirname, "./misc/default.png"));
});

app.use(
  session({
    cookie: {
      domain: ".f99.wtf",
      secure: true, //this should be set to "true" in production - only have it turned off because i dont have tls enabled
    },
    secret: "TEMPORARY_SECRET",
    name: "LTSID", //Legal Torrent Session ID
    resave: false, //avoid saving if nothing was modified
    store: new Store({ client: redis }),
    saveUninitialized: false,
  })
);

//Making the websocket acessible from every endpoint - must be included before routes!
app.use((req: Request, res, next) => {
  req.wss = new Socket(wss);
  next();
});

app.use(
  cors({
    allowedHeaders: ["content-type", "x-csrf-token"],
    origin: "https://lt.f99.wtf",
    exposedHeaders: ["x-csrf-token"],
    credentials: true
  })
);

app.use(device);
app.use(csurf());
app.use(express.json());

app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.code !== "EBADCSRFTOKEN") return next();

  res
    .status(401)
    .json({ status: "error", error: "Invalid CSRF token provided!" });
});

server.on("upgrade", (req: Request, socket, head) => {
  if (!req.session || !req.session.user) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    return socket.destroy();
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws: Ws, req: Request) => {
  if (!req.session || !req.session.user) return ws.close();

  ws.id = req.session.user.id;
});

server.listen(port, () => {
  console.log(
    `Launched server at: http://localhost:${port}\nCron jobs starting...`
  );
  start();
});

staticApp.listen(port + 1, () => {
  console.log(`Image server running at port ${port + 1}`);
});
