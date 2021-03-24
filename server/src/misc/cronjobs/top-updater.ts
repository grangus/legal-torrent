import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { RedisMethods } from "../redis";
import moment from "moment";

const prisma = new PrismaClient();
const redis = new RedisMethods();


const start = async () => {
  let ordered = await prisma.torrent.findMany({
    orderBy: { download_count: "desc" },
  });

  let top = ordered.slice(0, 100);

  let monthStart = moment().subtract(30, "days").startOf("day").toDate();
  let weekStart = moment().subtract(7, "days").startOf("day").toDate();
  let dayStart = moment().startOf("day").toDate();

  let last30 = await prisma.torrent.findMany({
    where: {
      downloads: {
        some: {
          date: {
            gte: monthStart,
          },
        },
      },
    },
    include: { downloads: true },
  });

  let sortedDownloadCounts = Array.from(
    last30.reduce((prev, current): any => {
      //i just put any type here but i dont think i should do that
      current.downloads.map((download) => {
        //this sorts downloads and puts the download in its respective time period
        //if the download was made within the last 24hrs, increase the day count and so on
        if (download.date.getTime() >= dayStart.getTime()) {
          let prevData = prev.get(current.id);

          if (!prevData) {
            prevData = { day: 1, week: 0, month: 0 };
          } else {
            let { week, month, day } = prevData;
            prev.set(current.id, { week, day: day + 1, month });
          }

          return;
        }

        if (download.date.getTime() >= weekStart.getTime()) {
          let prevData = prev.get(current.id);

          if (!prevData) {
            prevData = { day: 0, week: 1, month: 0 };
          } else {
            let { week, month, day } = prevData;
            prev.set(current.id, { week: week + 1, day, month });
          }

          return;
        }

        if (download.date.getTime() >= monthStart.getTime()) {
          let prevData = prev.get(current.id);

          if (!prevData) {
            prevData = { day: 0, week: 0, month: 1 };
          } else {
            let { week, month, day } = prevData;
            prev.set(current.id, { week, day, month: month + 1 });
          }

          return;
        }
      });
    }, new Map()),
    ([key, value]) => ({ key, value })
  );

  let topDay = sortedDownloadCounts
    .sort((a, b) => (a.value.day < b.value.day ? 1 : -1))
    .slice(0, 100)
    .map((t) => t.value);
  let topWeek = sortedDownloadCounts
    .sort((a, b) => (a.value.week < b.value.week ? 1 : -1))
    .slice(0, 100)
    .map((t) => t.value);
  let topMonth = sortedDownloadCounts
    .sort((a, b) => (a.value.month < b.value.month ? 1 : -1))
    .slice(0, 100)
    .map((t) => t.value);

  await redis.setTop("all", top);
  await redis.setTop("day", topDay);
  await redis.setTop("week", topWeek);
  await redis.setTop("month", topMonth);

  cron.schedule("*/10 * * * *", start);
};

export default start;
