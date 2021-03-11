export class Redis {
  private client;

  constructor() {
    this.client = global.GlobalRedisClient;
  }

  async addUserSession(userId: number, sessionId: string) {
    return await this.client.sadd(`user:${userId}:sessions`, sessionId);
  }

  async removeUserSession(userId: number, sessionId: string) {
    return await this.client.srem(`user:${userId}:sessions`, sessionId);
  }

  async getAllUserSessions(userId: number) {
    return await this.client.smembers(`user:${userId}:sessions`);
  }

  async removeAllUserSessions(userId: number) {
    return await this.client.del(`user:${userId}:sessions`);
  }
}
