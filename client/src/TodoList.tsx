import * as React from "react"

import {Component,} from "react";
import TaskList from "./TaskList";
import axios from "axios";

interface Props {
    id: string
}

interface State {
    taskDescription: string
    taskList: TaskList
}

export default class TodoList extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            taskDescription: "",
            taskList: new TaskList([])
        }
    }

    public componentDidMount() {
        axios.get("/trips/" + this.props.id + "/tasks")
            .then((response) => {
                console.log(JSON.stringify(response));
                this.setState({
                    taskList: new TaskList(response.data)
                });
            }).catch((error) => {
            console.log("TodoList! " + JSON.stringify(error));
            alert(JSON.stringify(error))
        });
    }

    public render() {
        return (
            <div>
                <form onSubmit={this.addTask}>
                    <label>Add task: <input type="text"
                                            value={this.state.taskDescription}
                                            onChange={this.handleChangeDescription}/> </label>
                    <input type="submit" value="Add item"/>
                </form>
                <p>TO DO</p>
                <ul>
                    {this.state.taskList.tasks.filter((item) => item.done === false)
                        .map((item) => this.createTasks(item, this.props.id))}
                </ul>
                <p>DONE</p>
                <ul>
                    {this.state.taskList.tasks.filter((item) => item.done === true)
                        .map((item) => this.createDoneTasks(item, this.props.id))}
                </ul>
            </div>
        );
    }

    private addTask = (event: any) => {
        axios.post("/trips/" + this.props.id + "/tasks/",
            {description: this.state.taskDescription}).then(response => {
            console.log(JSON.stringify(response));
            const reminder = this.state.taskList.tasks;
            const newTask = {id: response.data.id, description: response.data.description}
            reminder.push(newTask);
            this.setState({taskList: new TaskList(reminder)});
        }).catch((error) => {
            alert(JSON.stringify(error));
        });
        event.preventDefault();
    };

    private handleChangeDescription = (event: any) => this.setState({taskDescription: event.target.value});

    private createTasks(item: any, id: string) {
        const newFn = () => this.deleteTask(item.id, id);
        const doneFn = () => this.doneTask(item.id, id, true);
        return <li key={item.id}>{item.description}
            <button onClick={newFn}>❌</button> - <button onClick={doneFn}>Done</button>
        </li>
    }

    private createDoneTasks(item: any, id: string) {
        const newFn = () => this.deleteTask(item.id, id);
        const doneFn = () => this.doneTask(item.id, id, false);
        return <li key={item.id}>{item.description}
            <button onClick={newFn}>❌</button> - <button onClick={doneFn}>Undone</button>
        </li>
    }

    private doneTask = (id: string, tripId: string, doneValue: boolean) => {
        axios
            .put("/trips/" + tripId + "/tasks/" + id, { "done": doneValue } )
            .then(response => {
                const remainder = this.state.taskList.tasks.map((item) => {
                    if (item.id === id) {
                        item.done = doneValue;
                    }
                    return item;
                }); 
                this.setState({taskList: new TaskList(remainder)});
            })
            .catch((error) => {
                    alert(JSON.stringify(error));
                }
            );
    }

    private deleteTask = (id: string, tripId: string) => {
        axios
            .delete("/trips/" + tripId + "/tasks/" + id)
            .then(response => {
                const remainder = this.state.taskList.tasks.filter((item) => {
                    if (item.id !== id) {
                        return item;
                    }
                });
                this.setState({taskList: new TaskList(remainder)});
            })
            .catch((error) => {
                    alert(JSON.stringify(error));
                }
            );
    }
}