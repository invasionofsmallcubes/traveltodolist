import {Moment} from "moment";

export default class Trip {
    public readonly arrivalDate: Moment;
    public readonly departureDate: Moment;
    public readonly arrivalAirport: string;
    public readonly departureAirport: string;
    public readonly id: string;

    constructor(id: string, arrivalDate: Moment, departureDate: Moment, arrivalAirport: string, departureAirport: string) {
        this.arrivalAirport = arrivalAirport;
        this.arrivalDate = arrivalDate;
        this.departureAirport = departureAirport;
        this.departureDate = departureDate;
        this.id = id;
    }
}