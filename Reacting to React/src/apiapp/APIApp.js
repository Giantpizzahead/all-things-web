import User from "./User.js";

class APIApp extends React.Component {
    constructor() {
        super();

        this.state = {
            abortController: new AbortController(),
            isLoading: true
        }
    }

    componentDidMount() {
        console.log("Performing API call with 3 second delay...");
        fetch("https://reqres.in/api/users?delay=3", this.state.abortController)
        .then(response => response.json())
        .then(data => {
            console.log("Data receieved!");
            this.setState({isLoading: false, data: data});
        })
        .catch(() => {
            console.log("Aborted API call: Component unmounted (user probably switched pages).");
        });
    }

    componentWillUnmount() {
        this.state.abortController.abort();
    }
    
    render() {
        if (this.state.isLoading) return (
            <div className="lds-center">
                <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                <br />
                <p>Getting users from API...</p>
            </div>
        );
        
        let users = this.state.data.data.map(user => {
            return <User key={user.id} user={user} />;
        });

        return (
            <div>
                <h1 style={{textAlign: "center"}}>User List</h1>
                {users}
            </div>
        );
    }
}

export default APIApp;