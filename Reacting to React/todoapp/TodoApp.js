var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import TodoItem from "./TodoItem.js";

var TodoApp = function (_React$Component) {
    _inherits(TodoApp, _React$Component);

    function TodoApp() {
        _classCallCheck(this, TodoApp);

        var _this = _possibleConstructorReturn(this, (TodoApp.__proto__ || Object.getPrototypeOf(TodoApp)).call(this));

        _this.state = {
            currID: 6,
            todos: [{ id: 1, completed: true, title: "Create a Todo app" }, { id: 2, completed: false, title: "Try out the app by adding todos" }, { id: 3, completed: false, title: "Try deleting all the todos" }, { id: 4, completed: false, title: "Make a todo with a really long title to see if the system can handle it without looking really ugly (test of responsiveness)" }, { id: 5, completed: false, title: "Celebrate with video games!!!" }]
        };

        _this.handleCheckboxChange = _this.handleCheckboxChange.bind(_this);
        _this.deleteTodo = _this.deleteTodo.bind(_this);
        _this.createNewTodo = _this.createNewTodo.bind(_this);
        return _this;
    }

    _createClass(TodoApp, [{
        key: "handleCheckboxChange",
        value: function handleCheckboxChange(id) {
            console.log("Changing completed value of todo with id", id);
            this.setState(function (prevState) {
                return {
                    todos: prevState.todos.map(function (todo) {
                        if (todo.id === id) {
                            return Object.assign({}, todo, { completed: !todo.completed });
                        } else {
                            return todo;
                        }
                    })
                };
            });
        }
    }, {
        key: "deleteTodo",
        value: function deleteTodo(id) {
            console.log("Deleting todo with id", id);
            this.setState(function (prevState) {
                return {
                    todos: prevState.todos.filter(function (todo) {
                        return todo.id !== id;
                    })
                };
            });
        }
    }, {
        key: "createNewTodo",
        value: function createNewTodo() {
            var title = prompt("What would you like todo?");
            if (title == null || title == "") return; // User canceled or didn't put anything

            console.log("Creating new todo with title", title);

            this.setState(function (prevState) {
                return {
                    currID: prevState.currID + 1,
                    todos: [].concat(_toConsumableArray(prevState.todos), [{ id: prevState.currID, completed: false, title: title }])
                };
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            // console.log(this.state);
            var todoComponents = this.state.todos.map(function (todo) {
                return React.createElement(TodoItem, {
                    key: todo.id,
                    todo: todo,
                    handleCheckboxChange: _this2.handleCheckboxChange,
                    deleteTodo: _this2.deleteTodo
                });
            });
            return React.createElement(
                "div",
                { className: "todo-list" },
                React.createElement(
                    "h1",
                    { className: "todo-list-header" },
                    "My Todos"
                ),
                todoComponents.length != 0 ? todoComponents : React.createElement(
                    "h2",
                    { className: "todo-title" },
                    "No todos yet... add one below!"
                ),
                React.createElement(
                    "button",
                    { className: "todo-add-btn", onClick: this.createNewTodo },
                    React.createElement("i", { className: "fa fa-plus-circle" })
                )
            );
        }
    }]);

    return TodoApp;
}(React.Component);

export default TodoApp;