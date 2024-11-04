export type getRouteRidersResponse = {
    status: boolean,
    response: {
        idrelationship: string,
        driverid: string,
        riderid: string,
        amount: string,
        idroute: string,
        ridername: string ,
        ridersurname: string ,
        riderphone: string
    }[]
}