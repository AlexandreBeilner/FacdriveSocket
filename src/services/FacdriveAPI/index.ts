import {getRouteRidersResponse} from "./types";

export class FacdriveAPI {
    private static readonly baseURL = 'https://routing-app-aucug4gxfchndyas.brazilsouth-01.azurewebsites.net/facdrive';

    static async getRouteRiders(driverID: string, routeID: string){
        const resp = await fetch(this.baseURL + `/router/get-riders-by-route?routeID=${routeID}&driverID=${driverID}`);
        const respParsed = await resp.json() as getRouteRidersResponse;

        return respParsed.response.map(item => {
            return item.riderid;
        })
    }
}