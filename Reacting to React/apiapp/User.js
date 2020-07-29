function User(props) {
    var user = props.user;
    return React.createElement(
        "div",
        { className: "user-info" },
        React.createElement(
            "h2",
            null,
            user.first_name,
            " ",
            user.last_name
        ),
        React.createElement("img", { src: user.avatar }),
        React.createElement(
            "p",
            null,
            "Email: ",
            user.email
        )
    );
}

export default User;