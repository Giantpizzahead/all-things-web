class FormApp extends React.Component {
    constructor() {
        super();

        this.state = {
            probName: "",
            probDiff: "beginner",
            probActive: true,
            probStatement: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = name === "probActive" ? event.target.checked : event.target.value;
        this.setState({ [name]: value });
    }

    submitForm(event) {
        event.preventDefault();
        console.log("Submitted form with state", this.state);
        alert("If this were a real form, a POST request would now be sent with the following JSON data:\n" + JSON.stringify(this.state));
    }
    
    render() {
        return (
            <form id="form-prob" onSubmit={this.submitForm}>
                <h1>Create a Problem</h1>
                <br />
                <fieldset>
                    <legend>General Info</legend>
                    <label htmlFor="probName">Name </label>
                    <input type="text" name="probName" value={this.state.probName} onChange={this.handleChange} required />
                    <br /> <br />

                    <label htmlFor="probDiff">Difficulty</label>
                    <br />
                    <label>
                        <input type="radio" name="probDiff" value="beginner" checked={this.state.probDiff === "beginner"} onChange={this.handleChange} /> Beginner
                    </label>
                    <br />
                    <label>
                        <input type="radio" name="probDiff" value="intermediate" checked={this.state.probDiff === "intermediate"} onChange={this.handleChange} /> Intermediate
                    </label>
                    <br />
                    <label>
                        <input type="radio" name="probDiff" value="advanced" checked={this.state.probDiff === "advanced"} onChange={this.handleChange} /> Advanced
                    </label>
                    <br /> <br />

                    <label htmlFor="probActive">
                        <input type="checkbox" name="probActive" checked={this.state.probActive} onChange={this.handleChange} /> Is active?
                    </label>
                </fieldset>

                <br />
                <fieldset>
                    <legend>Problem Statement</legend>
                    <textarea
                        id="ta-prob-statement"
                        name="probStatement"
                        placeholder="Problem statement goes here..."
                        value={this.state.probStatement}
                        onChange={this.handleChange}
                        required
                    />
                </fieldset>
                <br />

                <button type="submit">Submit!</button>
            </form>
        );
    }
}

export default FormApp;