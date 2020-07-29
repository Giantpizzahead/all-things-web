import Header from "./Header.js";
import TodoApp from "./todoapp/TodoApp.js";
import FormApp from "./formapp/FormApp.js";
import APIApp from "./apiapp/APIApp.js";
import Footer from "./Footer.js";

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            page: "API"
        };

        this.handlePageChange = this.handlePageChange.bind(this);
    }

    handlePageChange(newPage) {
        this.setState({ page: newPage });
    }

    render() {
        return (
            <div>
                <Header page={this.state.page} handlePageChange={this.handlePageChange} />
                <main id="main-content">
                    {
                        this.state.page === "Todo" ?
                        <TodoApp />
                        : this.state.page === "Form" ?
                        <FormApp />
                        : this.state.page === "API" ?
                        <APIApp />
                        : <h1>Unknown page {this.state.page}!</h1>
                    }
                </main>
                <Footer />
            </div>
        );
    }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(<App />, domContainer);