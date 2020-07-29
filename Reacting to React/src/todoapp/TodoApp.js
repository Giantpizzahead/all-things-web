import TodoItem from "./TodoItem.js";

class TodoApp extends React.Component {
    constructor() {
        super();

        this.state = {
            currID: 6,
            todos: [
                {id: 1, completed: true, title: "Create a Todo app"},
                {id: 2, completed: false, title: "Try out the app by adding todos"},
                {id: 3, completed: false, title: "Try deleting all the todos"},
                {id: 4, completed: false, title: "Make a todo with a really long title to see if the system can handle it without looking really ugly (test of responsiveness)"},
                {id: 5, completed: false, title: "Celebrate with video games"}
            ]
        };

        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.deleteTodo = this.deleteTodo.bind(this);
        this.createNewTodo = this.createNewTodo.bind(this);
    }

    handleCheckboxChange(id) {
        console.log("Changing completed value of todo with id", id);
        this.setState(prevState => {
            return {
                todos: prevState.todos.map(todo => {
                    if (todo.id === id) {
                        return {...todo, completed: !todo.completed};
                    } else {
                        return todo;
                    }
                })
            };
        });
    }

    deleteTodo(id) {
        console.log("Deleting todo with id", id);
        this.setState(prevState => {
            return {
                todos: prevState.todos.filter(todo => {
                    return todo.id !== id;
                })
            };
        });
    }

    createNewTodo() {
        let title = prompt("What would you like todo?");
        if (title == null || title == "") return;  // User canceled or didn't put anything
        
        console.log("Creating new todo with title", title);
        
        this.setState(prevState => {
            return {
                currID: prevState.currID + 1,
                todos: [...prevState.todos, {id: prevState.currID, completed: false, title: title}]
            };
        });
    }
    
    render() {
        // console.log(this.state);
        let todoComponents = this.state.todos.map((todo) => {
            return (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    handleCheckboxChange={this.handleCheckboxChange}
                    deleteTodo={this.deleteTodo}
                />
            );
        });
        return (
            <div className="todo-list">
                <h1 className="todo-list-header">My Todos</h1>
                {todoComponents.length != 0 ? todoComponents : <h2 className="todo-title">No todos yet... add one below!</h2>}
                <button className="todo-add-btn" onClick={this.createNewTodo}>
                    <i className="fa fa-plus-circle"></i>
                </button>
            </div>
        );
    }
}

export default TodoApp;