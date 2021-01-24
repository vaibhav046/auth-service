
const sql = require('mssql');
const Permissions = require('../models/permissions');
const RoleService = require('./roles');
const UserService = require('./users');
const poolPromise = require('../config/sql-connector');

const getAllPermissions = async () => {
    let response = null;
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(`SELECT DISTINCT id,type from permissions where active=1`);
        if (result && result.recordset && result.recordset.length > 0) {
            response = result.recordset;
        }
        else {
            throw new Error('no records found');
        }
    } catch (err) {
        console.log(err);
    }
    return response;
}

const getAllActivePermissionsPerUser = async (id, email) => {
    let response = null;
    try {
        const user_id = await UserService.getUserIdByemail(email);
        const pool = await poolPromise
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('user_id', sql.Int, user_id)
            .query(`SELECT DISTINCT type from permissions where active=1 AND id=@id AND user_id=@user_id`);
        if (result && result.recordset && result.recordset.length > 0) {
            response = result.recordset;
        }
        else {
            throw new Error('no records found');
        }
    } catch (err) {
        console.log(err);
    }
    return response;
}

const createNewPermissions = async (body, type) => {
    let response = {};
    let { email, role } = body;
    try {
        let role_id = await RoleService.getRoleIdByUser(email, role);
        let user_id = await UserService.getUserIdByemail(email);
        let newPermission = new Permissions(type, true, role_id, user_id)
        const pool = await poolPromise
        const result = await pool.request()
            .input('type', sql.VarChar(50), newPermission.type)
            .input('active', sql.Bit, newPermission.active)
            .input('role_id', sql.Int, newPermission.role_id)
            .input('user_id', sql.Int, newPermission.user_id)
            .query(`INSERT INTO permissions(type,active,role_id,user_id) VALUES(@type,@active,@role_id,@user_id)`);
        if (result && result.rowsAffected && result.rowsAffected.length > 0) {
            response = {
                permission: newPermission.type,
                role_id: newPermission.role_id
            };
        } else {
            throw new Error('no records updated');
        }

    } catch (err) {
        console.log(err);
    }
    return response;
}

const _getPermissionsPerUserId = async (user_id) => {
    let response = null;
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query(`SELECT DISTINCT id,type from permissions where active=1 AND user_id=@user_id`);
        if (result && result.recordset && result.recordset.length > 0) {
            response = result.recordset;
        }
        else {
            throw new Error('no records found');
        }
    } catch (err) {
        console.log(err);
    }
    return response;
}

const mapNewRolePermission = async (role_id, payload) => {
    let mapped = false;
    let { type, active, user_id } = payload;
    try {
        let availablePermissions = await _getPermissionsPerUserId(user_id);
        if (availablePermissions.filter(e => e.type === type).length > 0) {
            let newPermission = new Permissions(type, active, role_id, user_id)
            const pool = await poolPromise
            const result = await pool.request()
                .input('type', sql.VarChar(50), newPermission.type)
                .input('active', sql.Bit, newPermission.active)
                .input('role_id', sql.Int, newPermission.role_id)
                .input('user_id', sql.Int, newPermission.user_id)
                .query(`INSERT INTO permissions(type,active,role_id,user_id) VALUES(@type,@active,@role_id,@user_id)`);
            if (result && result.rowsAffected && result.rowsAffected.length > 0) {
                mapped = true;
            } else {
                throw new Error('no records updated')
            }
        } else {
            throw new Error(`Error:check the list of available permissions from the following list ${availablePermissions}`);
        }
    } catch (err) {
        console.log(err);
    }
    return mapped;
}

module.exports = {
    getAllPermissions,
    getAllActivePermissionsPerUser,
    mapNewRolePermission,
    createNewPermissions
}