const rolesService = require('../services/roles');


module.exports = (app) => {
    app.get('/api/roles', async (req, res) => {
        try {
            const email = req.headers['email'];
            const result = await rolesService.getAllRolesByUser(email);
            res.send(result).status(200);

        } catch (e) {
            res.send(e).status(400);
        }
    });

    app.get('/api/users/:id/roles', async (req, res) => {
        try {
            const user_id = req.params.id;
            const result = await rolesService.getAllRolesByUser(null, user_id);
            res.send(result).status(200);
        } catch (e) {
            res.send(e).status(400);
        }
    });

    app.post('/api/users/:id/roles', async (req, res) => {
        try {
            let user_id = req.params.id;
            let body = req.body;
            const result = await rolesService.createRolesPerUser(user_id, body);
            res.send(result).status(200);
        } catch (e) {
            res.send(e).status(400);
        }
    });

    app.post('/api/roles', async (req, res) => {
        try {
            let id = req.id;
            let email = req.headers['email'];

        } catch (err) {
            res.send(e).status(400);
        }
    });
};
