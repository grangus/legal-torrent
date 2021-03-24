import { SessionData } from "express-session";
import ioredis, { Redis } from "ioredis";

type TimePeriod = "month" | "week" | "day";

interface TopTorrent {
  id: string;
  name: string;
  description: string;
  image: string;
}

export class RedisMethods {
  private client: Redis;

  constructor() {
    this.client = new ioredis();
  }

  async getSession(sessionId: string) {
    let raw = await this.client.get(`sess:${sessionId}`);

    if (!raw) throw Error("Invalid session!");

    let parsed: SessionData = JSON.parse(raw);

    return parsed;
  }

  async addUserSession(userId: number, sessionId: string) {
    return await this.client.sadd(`user:${userId}:sessions`, sessionId);
  }

  async removeUserSession(userId: number, sessionId: string) {
    await this.client.del(`sess:${sessionId}`);
    return await this.client.srem(`user:${userId}:sessions`, sessionId);
  }

  async getAllUserSessionIds(userId: number) {
    return await this.client.smembers(`user:${userId}:sessions`);
  }

  async removeAllUserSessions(userId: number) {
    let sessionIds = await this.getAllUserSessionIds(userId);

    for (let i = 0; i < sessionIds.length; i++) {
      try {
        await this.client.del(`sess:${sessionIds[i]}`);
      } catch (error) {}
    }

    return await this.client.del(`user:${userId}:sessions`);
  }

  async getAllUserSessions(userId: number) {
    let sessionIds = await this.getAllUserSessionIds(userId);
    let sessions = [];

    for (let i = 0; i < sessionIds.length; i++) {
      try {
        let session = await this.getSession(sessionIds[i]);

        if (session) {
          sessions.push(session);
        }
      } catch (error) {}
    }

    return sessions;
  }

  async getTop(period: TimePeriod) {
    let result = await this.client.get(`top-torrents-${period}`);

    return result ? JSON.parse(result) : [];
  }

  async setTop(period: TimePeriod, torrents: TopTorrent[]) {
    return await this.client.set(
      `top-torrents-${period}`,
      JSON.stringify(torrents)
    );
  }

  async getExclusiveTorrents(): Promise<TopTorrent[]> {
    let result = await this.client.get("exclusive-torrents");

    return result ? JSON.parse(result) : [];
  }

  private async setExclusiveTorrents(torrents: TopTorrent[]) {
    return await this.client.set(
      "exclusive-torrents",
      JSON.stringify(torrents)
    );
  }

  async addExclusiveTorrent(torrent: TopTorrent) {
    let torrents = await this.getExclusiveTorrents();

    torrents.push(torrent);

    return await this.setExclusiveTorrents(torrents);
  }

  async removeExclusiveTorrent(id: string) {
    let torrents = await this.getExclusiveTorrents();
    let index = torrents.findIndex((t) => t.id == id);

    if (index < 0) return;

    torrents.splice(index, 1);

    return await this.setExclusiveTorrents(torrents);
  }
}
