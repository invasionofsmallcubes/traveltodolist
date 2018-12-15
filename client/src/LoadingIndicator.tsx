import * as React from "react"
import {Component} from "react";

interface Props {
    isLoading: boolean
}
interface State {
    isPastDelay: boolean
}


export default class LoadingIndicator extends Component<Props, State> {

    private delayTimer: any;

    constructor(props: Props) {
        super(props);
        this.state = { isPastDelay : false }
    }

    public componentDidMount () {
        this.delayTimer = setTimeout(
            () => this.setState({isPastDelay: true}), 200
        );
    }

    public render() {
        if (this.props.isLoading) {
            if (!this.state.isPastDelay) {
                return null;
            }
            return <div>loading...</div>;
        }
        return this.props.children;
    }

    public componentWillUnmount() {
        clearTimeout(this.delayTimer);
    }
}