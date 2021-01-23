class Permissions {
    constructor(type, active = true, role_id, user_id) {
        this.type = type;
        this.active = active;
        this.role_id = role_id;
        this.user_id = user_id;
    }
}

module.exports = Permissions;