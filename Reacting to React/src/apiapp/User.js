function User(props) {
    let user = props.user;
    return (
        <div className="user-info">
            <h2>{user.first_name} {user.last_name}</h2>
            <img src={user.avatar} />
            <p>Email: {user.email}</p>
        </div>
    )
}

export default User;