const port = 3000;

import express, { Request, Response, NextFunction } from "express";
import routes from "./routes";
import session from "express-session";
import redisSession from "connect-redis";
import ioredis from "ioredis";
import csurf from "csurf";
import { device } from "./middlewares/device";

interface Error {
  code: string;
}

const app = express();

const Store = redisSession(session);
const redis = new ioredis();

app.use(
  session({
    cookie: {
      secure: false, //this should be set to "true" in production - only have it turned off because i dont have tls enabled
    },
    secret: "TEMPORARY_SECRET",
    name: "LTSID", //Legal Torrent Session ID
    resave: false, //avoid saving if nothing was modified
    store: new Store({ client: redis }),
    saveUninitialized: false,
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

//This needs to be added after all middlewares and endpoints so a 404 error is sent if the endpoint does not exist


app.listen(port, () => {
  console.log(`Launched server at: http://localhost:${port}`);
});
