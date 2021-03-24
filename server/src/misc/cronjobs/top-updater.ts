import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//TODO: figure out how the fuck im going to sort all of this crap
//brain note: top 100 = all time/month/week/day
//need to find torrents with downloads created in the past day/week/month(momentjs startOf method)
//sort them all by their specific time period, slice the top 100, cache them in redis
const start = () => {
  cron.schedule("*/10 * * * *", async () => {
    let ordered = await prisma.torrent.findMany({
      orderBy: { download_count: "desc" },
    });

    let top = ordered.slice(0, 100);

    //something to get torrents with downloads that have been made in a given time
    let a = await prisma.torrent.findMany({
      where: {
        downloads: { some: { date: { gte: new Date() } } },
      },
    });
  });
};

export default start;
