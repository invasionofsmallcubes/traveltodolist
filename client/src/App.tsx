import * as React from 'react';

import {Component} from "react";
import {Route} from "react-router";
import './App.css';
import CreateTrip from "./CreateTrip";
import LoadingIndicator from './LoadingIndicator';
import SeeTrip from "./SeeTrip";


interface State {
    isLoading: boolean
}


export default class App extends Component<any, State> {
    private delayTimer: any;

    constructor(props: any) {
        super(props);
        this.state = { isLoading : false }
    }

    public componentDidMount() {
        this.delayTimer = setTimeout(
            () => this.setState({isLoading: false}),
            2000
        );
    }

    public componentWillUnmount() {
        clearTimeout(this.delayTimer);
    }

    public render() {
        return (
            <div className="App">
                <Route exact={true} path="/" component={CreateTrip} />
                <Route exact={true} path="/loading" component={LoadingIndicator} />
                <Route path="/trip/:id" render={this.renderSeeTip} />
            </div>
        );
    }

    private renderSeeTip = (props: any) => <SeeTrip id={props.match.params.id}/>
}