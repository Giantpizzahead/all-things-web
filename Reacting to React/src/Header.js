class Header extends React.Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        this.props.handlePageChange(event.target.innerText);
    }

    render() {
        return (
            <header id="main-header">
                <nav>
                    <ul>
                        <li className={this.props.page === "Todo" ? "selected" : undefined}>
                            <a href="#" onClick={this.handleClick}>Todo</a>
                        </li>
                        <li className={this.props.page === "Form" ? "selected" : undefined}>
                            <a href="#" onClick={this.handleClick}>Form</a>
                        </li>
                        <li className={this.props.page === "API" ? "selected" : undefined}>
                            <a href="#" onClick={this.handleClick}>API</a>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Header;