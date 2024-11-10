
export interface UserConnections {
    [userId: string]: string;
}

export type rideProps = {
    routeID: string;
    driverID: string;
    message: {
        title: string,
        text: string
    }
}

export type chooseRouteProps = {
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