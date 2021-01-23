class Roles {
    constructor(role, active = true, user_id) {
        this.role = role;
        this.active = active;
        this.user_id = user_id;
    }
}

module.exports = Roles;