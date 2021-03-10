export class Redis {
  private client;

  constructor() {
    this.client = global.GlobalRedisClient;
  }

  async addUserSession(userId: number, sessionId: string) {
    return await this.client.sadd(`user:${userId}:session`, sessionId);
  }
}
