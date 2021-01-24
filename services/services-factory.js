class Services {
    constructor() {
        this.serviceType = null
        this.funcParams = [];
        this.func = null;
    }

    setup(serviceType, args) {
        this.serviceType = serviceType;
        this.func = args[0];
        this.funcParams = [];
        for (let i = 1; i < args.length; i++) {
            this.funcParams.push(args[i]);
        }
    }

    async execute() {
        let response = null;
        switch (this.serviceType) {
            case "roleService":
                let roleService = require('./roles');
                if (this.func === "getRoleIdByUser") {
                    response = await roleService.getRoleIdByUser(this.funcParams[0], this.funcParams[1]);
                    return response;
                }
                if (this.func === "createRolesPerUser") {
                    response = await roleService.createRolesPerUser(this.funcParams[0], this.funcParams[1]);
                    return response;
                }
                break;
            case "permissionService":
                let permissionService = require('./permissions');
                if (this.func === "createNewPermissions") {
                    response = await permissionService.createNewPermissions(this.funcParams[0], this.funcParams[1]);
                    return response;
                }
        }
    }
}

module.exports = Services;