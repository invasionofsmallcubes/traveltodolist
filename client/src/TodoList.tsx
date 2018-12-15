import axios from "axios";
import * as React from "react"
import {Component,} from "react";
import TaskList from "./TaskList";

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
                <ul>
                    {this.state.taskList.tasks.map((item) => this.createTasks(item, this.props.id))}
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
        return <li key={item.id}>{item.description}
            <button onClick={newFn}>❌</button>
        </li>
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