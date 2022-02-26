class User {

    static hasManagementRole = (user) => {
        for (let role in user?.roles) if (role == 1) return true;
        return false;
    }

    static aboutUser = (user) => {
        return "User " + user['name'] + " who has email: " + user['email'] + ", phone: " + user['phone'] + ", address: " + user['address'] +
            ". checkout " + " avatar: " + user['imageUrl'] + ".";
    }

}

export default User;