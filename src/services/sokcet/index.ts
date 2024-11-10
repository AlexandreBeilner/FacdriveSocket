import { Server, Socket } from "socket.io";
import {chooseRouteProps, rideProps, UserConnections} from "./types";
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

            this.rideManager(socket);
            this.onDisconnect(socket);
            this.chooseRoute(socket);
        });
    }

    private rideManager(socket: Socket) {
        socket.on("rideManager", async (data: string) => {
            const dataParsed: rideProps = JSON.parse(data);
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

    private chooseRoute(socket: Socket) {
        socket.on("chooseRoute", async (data: string) => {
            const dataParsed: chooseRouteProps = JSON.parse(data);
            const targetSocketId = this.userConnections[dataParsed.driverID.toString()];
            if (targetSocketId) {
                this.io.to(targetSocketId).emit("messageFromServer", JSON.stringify(dataParsed.message));
                console.log(`Mensagem enviada para o usuário ${dataParsed.driverID}: ${dataParsed.message}`);
            } else {
                console.log(`Usuário ${dataParsed.driverID} não está conectado`);
            }
        });
    }

    private onDisconnect(socket: Socket) {
        socket.on("disconnect", () => {
            console.log(`Usuário ${socket.userId} desconectado`);
            delete this.userConnections[socket.userId as string];
        });
    }
}
