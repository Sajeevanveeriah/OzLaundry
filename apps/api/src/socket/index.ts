import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, { cors: { origin: true, credentials: true } });
  io.on("connection", (socket) => {
    socket.on("join:user", (userId: string) => socket.join(`user:${userId}`));
  });
  return io;
}

export function emitOrderUpdate(userId: string, payload: unknown) {
  io?.to(`user:${userId}`).emit("order:updated", payload);
}
