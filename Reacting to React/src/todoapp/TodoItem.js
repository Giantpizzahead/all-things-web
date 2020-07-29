class TodoItem extends React.Component {
    constructor() {
        super();

        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.deleteTodo = this.deleteTodo.bind(this);
    }

    handleCheckboxChange() {
        this.props.handleCheckboxChange(this.props.todo.id);
    }

    deleteTodo() {
        this.props.deleteTodo(this.props.todo.id);
    }

    render() {
        return (
            <div className={this.props.todo.completed ? "todo-item todo-item-completed" : "todo-item"}>
                <input
                    className="todo-checkbox"
                    type="checkbox"
                    checked={this.props.todo.completed}
                    onChange={this.handleCheckboxChange}
                />
                <h4 className="todo-title">{this.props.todo.title}</h4>
                {this.props.todo.completed &&
                    <button className="todo-delete-btn" onClick={this.deleteTodo}>
                        <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>}
            </div>
        )
    }
}

export default TodoItem;