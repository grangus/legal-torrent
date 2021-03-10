const port = 5000;

import express from "express";
import routes from "./routes";
import session from "express-session";
import redisSession from "connect-redis";
import ioredis from "ioredis";

const app = express();

const Store = redisSession(session);
const client = new ioredis();

app.use(express.json());
app.use(routes);

app.use(
  session({
    cookie: {
      secure: false, //this should be set to "true" in production - only have it turned off because i dont have tls enabled
    },
    secret: "TEMPORARY_SECRET",
    name: "LTSID", //Legal Torrent Session ID
    resave: false, //avoid saving if nothing was modified
    store: new Store({ client: client }),
  })
);

app.listen(port, () => {
  console.log(`Launched server at: http://localhost:${port}`);
});
