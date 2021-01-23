const permissionService = require('../services/permissions');

module.exports = (app) => {
    app.get('/api/permissions', async (req, res) => {
        try {
            const result = await permissionService.getAllPermissions();
            res.send(result).status(200);

        } catch (e) {
            res.send(e).status(400);
        }
    });

    app.post('/api/permissions', async (req, res) => {
        try {
            let body = { email: req.headers['email'], role: req.body.role };
            let type = req.body.type;
            if (body && body.email && body.role) {
                const result = await permissionService.createNewPermissions(body, type);
                res.send(result).status(200);
            } else {
                throw new Error('Request body has errors')
            }

        } catch (e) {
            res.send(e).status(400);
        }
    });

    app.post('/api/users/:id/permissions', async (req, res) => {
        try {
            let id = req.params.id;
            let email = req.headers['email'];
            if (id && email) {
                const result = await permissionService.getAllActivePermissionsPerUser(id, email);
                res.send(result).status(200);
            } else {
                throw new Error('Request body has errors')
            }
        } catch (e) {
            res.send(e).status(400);
        }
    });
};

