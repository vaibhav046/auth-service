/**
 * Users Model.
 *
 * @class Users
 */
class Users {
    constructor(email, username, password, active = true) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.active = active;
    }
}

module.exports = Users;