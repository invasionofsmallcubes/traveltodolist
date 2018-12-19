import axios from 'axios';
import * as moment from "moment";
import * as React from "react"
import {Component} from "react";

import DatePicker from "react-datepicker";

import {Moment} from "moment";
import "react-datepicker/dist/react-datepicker.css";
import {RouteComponentProps, withRouter} from 'react-router-dom'
import Trip from './Trip';

interface State {
    arrivalDate: Moment,
    departureDate: Moment,
    arrivalAirport: string,
    departureAirport: string,
    existingTrips: Trip[]
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
            existingTrips: []
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

        const trips = this.state.existingTrips.map((trip) => <li key={trip.id}>{trip.id}</li>);

        return (
            <div>
                <ul>{trips}</ul>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Departure Airport:
                        <input type="text" value={this.state.departureAirport} onChange={this.handleChangeDeparture}/>
                    </label>
                    <br/>
                    <label>
                        Arrival Airport:
                        <input type="text" value={this.state.arrivalAirport} onChange={this.handleChangeArrival}/>
                    </label>
                    <br/>
                    <label>
                        Departure Date:
                        <DatePicker
                            selected={this.state.departureDate}
                            onChange={this.onChangeDepartureDate}
                        />
                    </label>
                    <br/>
                    <label>
                        Arrival Date:
                        <DatePicker
                            selected={this.state.arrivalDate}
                            onChange={this.onChangeArrivalDate}
                        />
                    </label>
                    <br/>
                    <input type="submit" value="Create my todo list!"/>
                </form>
            </div>
        );
    }

    private handleSubmit = (event: any) => {
            axios.post("/trips", this.state).
                then( response => {
                    console.log(JSON.stringify(response));
                // @ts-ignore
                this.props.history.push('/trip/' + response.data);
            }).catch((error) => {
                alert(JSON.stringify(error));
            });
        event.preventDefault();
    };

    private handleChangeArrival = (event: any) => {
        this.setState({arrivalAirport: event.target.value});
    };


    private handleChangeDeparture = (event: any) => this.setState({departureAirport: event.target.value});

    private onChangeArrivalDate = (date: Moment) => this.setState({arrivalDate: date});
    private onChangeDepartureDate = (date: Moment) => this.setState({departureDate: date});
}

export default withRouter(CreateTrip);