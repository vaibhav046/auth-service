const userService = require('../services/users');
const jwt = require('../config/jwt-module');
const signOptions = require('../signing-config/issuers-config');

module.exports = (app) => {
    app.post('/api/login', async (req, res) => {
        let body = req.body;
        let response = await userService.loginRequests(body);
        const resp = {
            token: jwt.sign(response),
        }
        res.send(resp).status(200);
    });
}