import "react-datepicker/dist/react-datepicker.css";

import * as React from "react"
import * as moment from "moment";

import { Link, RouteComponentProps, withRouter } from 'react-router-dom'

import { Component } from "react";
import DatePicker from "react-datepicker";
import Trip from './Trip';
import axios from 'axios';

interface State {
    arrivalDate: moment.Moment,
    departureDate: moment.Moment,
    arrivalAirport: string,
    departureAirport: string,
    existingTrips: Trip[],
    options: string[]
}

interface MatchParams {
    id: string;
}

interface IomponentProps extends Partial<RouteComponentProps<MatchParams>> {
    myPersonalProp: string;
}

class CreateTrip extends Component<IomponentProps, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            arrivalAirport: '',
            arrivalDate: moment(),
            departureAirport: '',
            departureDate: moment(),
            existingTrips: [],
            options: []
        }
    }

    public componentDidMount() {
        axios.get("/trips/")
            .then((response) => {
                console.log(JSON.stringify(response));
                this.setState({ existingTrips: response.data });
            }).catch((error) => {
                console.log(JSON.stringify(error));
                alert(JSON.stringify(error))
            });
    }

    public render() {

        const trips = this.state.existingTrips.map((trip) => <li key={trip.id}><Link to={"/trip/" + trip.id}>Click {trip.id}</Link> </li>);

        return (
            <div>
                <ul>{trips}</ul>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Departure Airport:
                        <input type="text" value={this.state.departureAirport} onChange={this.handleChangeDeparture} />
                    </label>
                    <br />
                    <label>
                        Options (comma separated, possible values: fun, work):
                        <input type="text" value={this.state.options} onChange={this.handleOptions} />
                    </label>
                    <br />
                    <label>
                        Arrival Airport:
                        <input type="text" value={this.state.arrivalAirport} onChange={this.handleChangeArrival} />
                    </label>
                    <br />
                    <label>
                        Departure Date:
                        <DatePicker
                            selected={this.state.departureDate}
                            onChange={this.onChangeDepartureDate}
                        />
                    </label>
                    <br />
                    <label>
                        Arrival Date:
                        <DatePicker
                            selected={this.state.arrivalDate}
                            onChange={this.onChangeArrivalDate}
                        />
                    </label>
                    <br />
                    <input type="submit" value="Create my todo list!" />
                </form>
            </div>
        );
    }

    private handleSubmit = (event: any) => {

        const request = {
            "arrivalAirport": this.state.arrivalAirport,
            "arrivalDate": this.state.arrivalDate,
            "departureAirport": this.state.departureAirport,
            "departureDate": this.state.departureDate,
            "options" : this.state.options
        };

        axios.post("/trips", request).
            then(response => {
                console.log(JSON.stringify(response));
                // @ts-ignore
                this.props.history.push('/trip/' + response.data);
            }).catch((error) => {
                alert(JSON.stringify(error));
            });
        event.preventDefault();
    };

    private handleChangeArrival = (event: any) => {
        this.setState({ arrivalAirport: event.target.value });
    };


    private handleChangeDeparture = (event: any) => this.setState({ departureAirport: event.target.value });
    private handleOptions = (event: any) => this.setState({ options: event.target.value.split(",").map((word: string) => word.trim()) });

    private onChangeArrivalDate = (date: moment.Moment) => this.setState({ arrivalDate: date });
    private onChangeDepartureDate = (date: moment.Moment) => this.setState({ departureDate: date });
}

export default withRouter(CreateTrip);