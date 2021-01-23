
const sql = require('mssql');
const Roles = require('../models/roles');
const Permissions = require('../models/permissions');
const poolPromise = require('../config/sql-connector');
const userService = require('./users');
const permissionService = require('./permissions');

const getAllRolesByUser = async (email, user_id = null) => {
    let role_id = null;
    try {
        const user_id = user_id ? user_id : await userService.getUserIdByemail(email);
        const pool = await poolPromise
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query(`SELECT id,role from roles where user_id=@user_id AND active=1`);
        if (result && result.recordset && result.recordset.length > 0) {
            role_id = result.recordset;
        }
        else {
            throw new Error('no records found');
        }
    } catch (err) {
        console.log(err);
    }
    return role_id;
}

const getRoleIdByUser = async (email, role) => {
    let role_id = null;
    try {
        const user_id = await userService.getUserIdByemail(email);
        const pool = await poolPromise
        const result = await pool.request()
            .input('role', sql.VarChar(50), role)
            .input('user_id', sql.Int, user_id)
            .query(`SELECT id from roles where role=@role AND user_id=@user_id AND active=1`);
        if (result && result.recordset && result.recordset.length > 0 && result.recordset[0].id) {
            role_id = result.recordset[0].id;
        }
        else {
            throw new Error('no records found');
        }
    } catch (err) {
        console.log(err);
    }
    return role_id;
}

const _getLastInsertedRecordfForUser = async (user_id) => {
    let id = null;
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query(`SELECT TOP 1 id from roles where user_id=@user_id AND active=1 order by id desc`);
        if (result && result.recordset && result.recordset.length > 0 && result.recordset[0].id) {
            id = result.recordset[0].id
        }
    } catch (err) {

        console.log(err);
    }
    return id;
}

const createRoleForUserWithPermissions = async (email, body) => {
    let { role, permissions } = body;
    let response = null;
    try {
        const user_id = await userService.getUserIdByemail(email);
        const newRole = new Roles(role, true, user_id);
        let pool = await poolPromise
        let result = await pool.request()
            .input('role', sql.VarChar(50), newRole.role)
            .input('active', sql.Bit, newRole.active)
            .input('user_id', sql.Int, newRole.user_id)
            .query(`INSERT INTO roles(type,active,user_id) VALUES(@type,@active,@user_id)`);
        if (result && result.rowsAffected && result.rowsAffected.length > 0) {
            const id = await _getLastInsertedRecordfForUser(user_id);
            permissions.user_id = user_id;
            const mapped = await permissionService.mapNewRolePermission(id, permissions);
            if (!mapped) {
                pool = await poolPromise
                result = await pool.request()
                    .input('id', sql.Int, id)
                    .query(`UPDATE roles set active=0 where id=@id`);
                if (result && result.rowsAffected && result.rowsAffected.length > 0) {
                    throw new Error('transaction failed');
                }
            } else {
                response = `updated ${result.rowsAffected} records `
            }
        } else {
            throw new Error('no records updated');
        }
    } catch (err) {
        console.log(err);
    }
    return response;
}

const createRolesPerUser = async (user_id, body) => {
    let response = null;
    let affectedRows = 0;
    try {
        for (let i = 0; i < body.length; i++) {
            let role = body[i].role;
            let active = true;
            let pool = await poolPromise
            let result = await pool.request()
                .input('role', sql.VarChar(50), role)
                .input('active', sql.Bit, active)
                .input('user_id', sql.Int, user_id)
                .query(`INSERT INTO roles(role, active, user_id) VALUES (@role,@active,@user_id)`);
            if (result && result.rowsAffected && result.rowsAffected.length > 0) {
                affectedRows = body.length;
            }
        }
        if (affectedRows) {
            response = `updated ${affectedRows} records `;
        } else {
            throw new Error('no records updated');
        }
    } catch (err) {
        console.log(err);
    }

    return response;
}


module.exports = {
    getRoleIdByUser,
    getAllRolesByUser,
    createRolesPerUser,
    createRoleForUserWithPermissions
}