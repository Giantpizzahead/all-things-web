var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import User from "./User.js";

var APIApp = function (_React$Component) {
    _inherits(APIApp, _React$Component);

    function APIApp() {
        _classCallCheck(this, APIApp);

        var _this = _possibleConstructorReturn(this, (APIApp.__proto__ || Object.getPrototypeOf(APIApp)).call(this));

        _this.state = {
            abortController: new AbortController(),
            isLoading: true
        };
        return _this;
    }

    _createClass(APIApp, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            console.log("Performing API call with 3 second delay...");
            fetch("https://reqres.in/api/users?delay=3", this.state.abortController).then(function (response) {
                return response.json();
            }).then(function (data) {
                console.log("Data receieved!");
                _this2.setState({ isLoading: false, data: data });
            }).catch(function () {
                console.log("Aborted API call: Component unmounted (user probably switched pages).");
            });
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            this.state.abortController.abort();
        }
    }, {
        key: "render",
        value: function render() {
            if (this.state.isLoading) return React.createElement(
                "div",
                { className: "lds-center" },
                React.createElement(
                    "div",
                    { className: "lds-spinner" },
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null),
                    React.createElement("div", null)
                ),
                React.createElement("br", null),
                React.createElement(
                    "p",
                    null,
                    "Getting users from API..."
                )
            );

            var users = this.state.data.data.map(function (user) {
                return React.createElement(User, { key: user.id, user: user });
            });

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "h1",
                    { style: { textAlign: "center" } },
                    "User List"
                ),
                users
            );
        }
    }]);

    return APIApp;
}(React.Component);

export default APIApp;