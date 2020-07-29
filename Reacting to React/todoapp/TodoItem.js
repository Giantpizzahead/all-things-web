var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TodoItem = function (_React$Component) {
    _inherits(TodoItem, _React$Component);

    function TodoItem() {
        _classCallCheck(this, TodoItem);

        var _this = _possibleConstructorReturn(this, (TodoItem.__proto__ || Object.getPrototypeOf(TodoItem)).call(this));

        _this.handleCheckboxChange = _this.handleCheckboxChange.bind(_this);
        _this.deleteTodo = _this.deleteTodo.bind(_this);
        return _this;
    }

    _createClass(TodoItem, [{
        key: "handleCheckboxChange",
        value: function handleCheckboxChange() {
            this.props.handleCheckboxChange(this.props.todo.id);
        }
    }, {
        key: "deleteTodo",
        value: function deleteTodo() {
            this.props.deleteTodo(this.props.todo.id);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: this.props.todo.completed ? "todo-item todo-item-completed" : "todo-item" },
                React.createElement("input", {
                    className: "todo-checkbox",
                    type: "checkbox",
                    checked: this.props.todo.completed,
                    onChange: this.handleCheckboxChange
                }),
                React.createElement(
                    "h4",
                    { className: "todo-title" },
                    this.props.todo.title
                ),
                this.props.todo.completed && React.createElement(
                    "button",
                    { className: "todo-delete-btn", onClick: this.deleteTodo },
                    React.createElement("i", { className: "fa fa-trash", "aria-hidden": "true" })
                )
            );
        }
    }]);

    return TodoItem;
}(React.Component);

export default TodoItem;