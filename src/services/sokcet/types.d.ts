
export interface UserConnections {
    [userId: string]: string;
}

export type sendToUserProps = {
    routeID: string;
    driverID: string;
    message: {
        title: string,
        text: string
    }
}

declare module 'socket.io' {
    interface Socket {
        userId: string | undefined;
    }
}