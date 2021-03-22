import { Server, Ws } from "ws";

interface Notification {
  title: string;
  message: string;
}

export default class Socket {
  private wss: Server;

  constructor(wss: Server) {
    this.wss = wss;
  }

  sendNotification(userId: number | undefined, notification: Notification) {
    this.wss.clients.forEach((client: Ws) => {
      if (client.id == userId) {
        client.send({
          event: "notification",
          data: notification,
        });
      }
    });
  }

  massNotification(notification: Notification) {
    this.wss.clients.forEach((client: Ws) => {
      client.send(notification);
    });
  }
}
