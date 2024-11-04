import { Server, Socket } from "socket.io";
import {sendToUserProps, UserConnections} from "./types";
import {FacdriveAPI} from "../FacdriveAPI";

export class NotificationSocket {
    private userConnections: UserConnections = {};
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        io.on("connection", (socket: Socket) => {
            const userId = socket.handshake.query.userId as string;
            if (!userId) {
                return;
            }

            socket.userId = userId;
            this.userConnections[userId] = socket.id;
            console.log(`Cliente conectado: ${socket.id} com ID de usuário: ${userId}`);

            this.sendToUser(socket);
            this.onDisconnect(socket);
        });
    }

    private sendToUser(socket: Socket) {
        socket.on("sendToUser", async (data: string) => {
            const dataParsed: sendToUserProps = JSON.parse(data);
            const ridersID = await FacdriveAPI.getRouteRiders(dataParsed.driverID, dataParsed.routeID);

            ridersID.forEach(targetID => {
                const targetSocketId = this.userConnections[targetID.toString()];
                if (targetSocketId) {
                    this.io.to(targetSocketId).emit("messageFromServer", JSON.stringify(dataParsed.message));
                    console.log(`Mensagem enviada para o usuário ${targetID}: ${dataParsed.message}`);
                } else {
                    console.log(`Usuário ${targetID} não está conectado`);
                }
            })
        });
    }

    private onDisconnect(socket: Socket) {
        socket.on("disconnect", () => {
            console.log(`Usuário ${socket.userId} desconectado`);
            delete this.userConnections[socket.userId as string];
        });
    }
}
