
const sql = require('mssql');
const poolPromise = require('../config/sql-connector');
const Users = require('../models/users');
let serviceFactory = require('./services-factory');
let sf = new serviceFactory();

/**
 * Gets user id by email.
 *
 * @param {*} email
 * @returns user_id
 */
const getUserIdByemail = async (email) => {
    let user_id = null;
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .input('email', sql.VarChar(50), email)
            .query(`SELECT id from users where email=@email and active=1`);
        if (result && result.recordset && result.recordset.length > 0 && result.recordset[0].id) {
            user_id = result.recordset[0].id;
        }
        else {
            throw new Error('no records found');
        }
    } catch (err) {
        console.log(err);
    }
    return user_id;
}

/**
 * handles login request.
 *
 * @param {*} body{ email, username/password }
 * @returns response
 */
const loginRequests = async (body) => {
    let response = null;
    let { email, username, password } = body;
    try {
        if (email && password) {
            let pool = await poolPromise
            let result = await pool.request()
                .input('email', sql.VarChar(50), email)
                .query(`select email,username,type,role from users u INNER JOIN permissions p ON u.id=p.user_id INNER JOIN roles r ON u.id=r.user_id where email=@email AND u.active=1 AND r.active=1 and p.active=1`);
            if (result && result.recordset && result.recordset.length > 0) {
                let permissions = new Set();
                let roles = new Set();
                result.recordset.map(x => {
                    permissions.add(x.type);
                    roles.add(x.role);
                });
                response = { email: result.recordset[0].email, upn: result.recordset[0].email, username: result.recordset[0].username, permissions: [...permissions], roles: [...roles] }
            }
        }
        else if (username && password) {
            let pool = await poolPromise
            let result = await pool.request()
                .input('username', sql.VarChar(50), username)
                .query(`select email,username,type,role from users u INNER JOIN permissions p ON u.id=p.user_id INNER JOIN roles r  ON u.id=r.user_id where username=@username AND u.active=1 AND r.active=1 and p.active=1`);
            if (result && result.recordset && result.recordset.length > 0) {
                let permissions = new Set();
                let roles = new Set();
                result.recordset.map(x => {
                    permissions.add(x.type);
                    roles.add(x.role);
                });
                response = { email: result.recordset[0].email, upn: result.recordset[0].email, username: result.recordset[0].username, permissions: [...permissions], roles: [...roles] }
            }
        }
        else {
            throw new Error('no records found');
        }
    } catch (err) {
        console.log(err);
    }
    return response;
}

/**
 * signs up new users.
 *
 * @param {*} body{ email, username, password }
 * @returns response
 */
const signup = async (body) => {
    let response = null;
    let { email, username, password } = body;
    try {
        if (email && password && username) {
            let newUser = new Users(email, username, password);
            let pool = await poolPromise
            let result = await pool.request()
                .input('email', sql.VarChar(50), newUser.email)
                .input('username', sql.VarChar(50), newUser.username)
                .input('password', sql.VarChar(50), newUser.password)
                .input('active', sql.Bit, newUser.active)
                .query(`INSERT INTO users(email,username,password,active) VALUES(@email,@username,@password,@active)`);
            if (result && result.rowsAffected && result.rowsAffected.length > 0) {
                const user_id = await getUserIdByemail(newUser.email);
                let body = [{ role: 'user' }]
                sf.setup("roleService", ["createRolesPerUser", user_id, body]);
                let affectedRoles = await sf.execute();
                if (affectedRoles) {
                    let payload = { email: newUser.email, role: 'user' };
                    sf.setup("permissionService", ["createNewPermissions", payload, 'read'])
                    let resp = await sf.execute();
                    if (resp) {
                        response = await loginRequests({ email, password });
                    }
                }
            } else {
                throw new Error('no records updated');
            }
        } else {
            throw new Error('email/username/password missing from the body');
        }
    } catch (err) {
        console.log(err);
    }
    return response;

}

module.exports = {
    getUserIdByemail,
    loginRequests,
    signup
}