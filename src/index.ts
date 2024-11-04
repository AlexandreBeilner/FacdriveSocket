import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { NotificationSocket } from "./services/sokcet";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

new NotificationSocket(io);

httpServer.listen(3000, () => {
    console.log('Servidor WebSocket rodando na porta 3000');
});
