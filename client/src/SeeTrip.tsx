import axios from 'axios';
import * as moment from "moment";
import * as React from "react"
import {Component} from "react"
import TodoList from "./TodoList"
import Trip from "./Trip";

interface Props {
    id: string
}

interface State {
    trip: Trip
}

export default class SeeTrip extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            trip: new Trip("",
                moment(),
                moment(),
                "",
                "")
        }
    }

    public componentDidMount() {
        axios.get("/trips/" + this.props.id)
            .then((response) => {
                console.log(JSON.stringify(response));
                this.setState({
                    trip: new Trip(response.data.id,
                        moment(response.data.arrivalDate),
                        moment(response.data.departureDate),
                        response.data.arrivalAirport,
                        response.data.departureAirport)
                });
            }).catch((error) => {
            console.log(JSON.stringify(error));
            alert(JSON.stringify(error))
        });
    }

    public render() {
       return (
            <div><p>TODO LIST {this.state.trip.id} FOR YOUR TRIP FROM {this.state.trip.departureAirport}
                TO {this.state.trip.arrivalAirport} DEPARTING AT {this.state.trip.departureDate.toDate().toDateString()}
                RETURNING AT {this.state.trip.arrivalDate.toString()}</p>
                <TodoList id={this.props.id}/>
            </div>
        );
    }
}
