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
    options: string[],
    typeOfTasks: any[]
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
            options: [],
            typeOfTasks: []
        }
    }

    public async componentDidMount() {
        try {
            const trips = await axios.get("/trips/");
            const typeOfTasks = await axios.get("/trips/types/");
            this.setState({ existingTrips: trips.data, 
                typeOfTasks: typeOfTasks.data });
        } catch (error) {
            alert(JSON.stringify(error))
        }
    }

    public render() {

        const trips = this.state.existingTrips.map((trip) => <li key={trip.id}><Link to={"/trip/" + trip.id}>Click {trip.id}</Link></li>);
        
        const tasks = this.state.typeOfTasks.map((task) => {
            let bgColor = "white";
            if (this.state.options.indexOf(task.id) > -1) {
                bgColor = "red"    
            }
            return <li style={{backgroundColor: bgColor}} key={task.id} onClick={this.addTypeOfTask} value={task.id}>{task.description}</li>
        });

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
                        Options (comma separated, possible values: fun, work): <ul>{tasks}</ul>
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
            "options": this.state.options
        };

        axios.post("/trips", request).
            then(response => {
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

    private addTypeOfTask = (event: any) => {
        let newOptions = this.state.options
        const value = event.currentTarget.getAttribute('value')
        if (newOptions.indexOf(value) > -1) {
            newOptions = newOptions.filter(elem => elem !== value)
        } else {
            newOptions.push(event.currentTarget.getAttribute('value'));
        }
        this.setState({ options: newOptions });
    };
    
    private handleChangeDeparture = (event: any) => this.setState({ departureAirport: event.target.value });

    private onChangeArrivalDate = (date: moment.Moment) => this.setState({ arrivalDate: date });
    private onChangeDepartureDate = (date: moment.Moment) => this.setState({ departureDate: date });
}

export default withRouter(CreateTrip);