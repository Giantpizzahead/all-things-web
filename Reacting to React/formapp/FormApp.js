var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormApp = function (_React$Component) {
    _inherits(FormApp, _React$Component);

    function FormApp() {
        _classCallCheck(this, FormApp);

        var _this = _possibleConstructorReturn(this, (FormApp.__proto__ || Object.getPrototypeOf(FormApp)).call(this));

        _this.state = {
            probName: "",
            probDiff: "beginner",
            probActive: true,
            probStatement: ""
        };

        _this.handleChange = _this.handleChange.bind(_this);
        _this.submitForm = _this.submitForm.bind(_this);
        return _this;
    }

    _createClass(FormApp, [{
        key: "handleChange",
        value: function handleChange(event) {
            var name = event.target.name;
            var value = name === "probActive" ? event.target.checked : event.target.value;
            this.setState(_defineProperty({}, name, value));
        }
    }, {
        key: "submitForm",
        value: function submitForm(event) {
            event.preventDefault();
            console.log("Submitted form with state", this.state);
            alert("If this were a real form, a POST request would now be sent with the following JSON data:\n" + JSON.stringify(this.state));
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "form",
                { id: "form-prob", onSubmit: this.submitForm },
                React.createElement(
                    "h1",
                    null,
                    "Create a Problem"
                ),
                React.createElement("br", null),
                React.createElement(
                    "fieldset",
                    null,
                    React.createElement(
                        "legend",
                        null,
                        "General Info"
                    ),
                    React.createElement(
                        "label",
                        { htmlFor: "probName" },
                        "Name "
                    ),
                    React.createElement("input", { type: "text", name: "probName", value: this.state.probName, onChange: this.handleChange, required: true }),
                    React.createElement("br", null),
                    " ",
                    React.createElement("br", null),
                    React.createElement(
                        "label",
                        { htmlFor: "probDiff" },
                        "Difficulty"
                    ),
                    React.createElement("br", null),
                    React.createElement(
                        "label",
                        null,
                        React.createElement("input", { type: "radio", name: "probDiff", value: "beginner", checked: this.state.probDiff === "beginner", onChange: this.handleChange }),
                        " Beginner"
                    ),
                    React.createElement("br", null),
                    React.createElement(
                        "label",
                        null,
                        React.createElement("input", { type: "radio", name: "probDiff", value: "intermediate", checked: this.state.probDiff === "intermediate", onChange: this.handleChange }),
                        " Intermediate"
                    ),
                    React.createElement("br", null),
                    React.createElement(
                        "label",
                        null,
                        React.createElement("input", { type: "radio", name: "probDiff", value: "advanced", checked: this.state.probDiff === "advanced", onChange: this.handleChange }),
                        " Advanced"
                    ),
                    React.createElement("br", null),
                    " ",
                    React.createElement("br", null),
                    React.createElement(
                        "label",
                        { htmlFor: "probActive" },
                        React.createElement("input", { type: "checkbox", name: "probActive", checked: this.state.probActive, onChange: this.handleChange }),
                        " Is active?"
                    )
                ),
                React.createElement("br", null),
                React.createElement(
                    "fieldset",
                    null,
                    React.createElement(
                        "legend",
                        null,
                        "Problem Statement"
                    ),
                    React.createElement("textarea", {
                        id: "ta-prob-statement",
                        name: "probStatement",
                        placeholder: "Problem statement goes here...",
                        value: this.state.probStatement,
                        onChange: this.handleChange,
                        required: true
                    })
                ),
                React.createElement("br", null),
                React.createElement(
                    "button",
                    { type: "submit" },
                    "Submit!"
                )
            );
        }
    }]);

    return FormApp;
}(React.Component);

export default FormApp;