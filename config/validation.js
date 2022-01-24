const {pool} = require('../config/database');
const jwt = require('jsonwebtoken');
const secret_config = require('../config/secret');
const {logger} = require('../config/winston');

async function isValidUser(userId) {
    try {
        const connection = await pool.getConnection(async conn => conn);
        const isVaildTokenQuery = `select exists(select userId from users where userId = ? and status = 'Y') as exist;`;
        const [isVaildToken] = await connection.query(isVaildTokenQuery, userId);

        connection.release();
        return isVaildToken[0].exist
    } catch {
        return false;
    }
}


async function isDeclaredUser(userId) {
    try {
        const connection = await pool.getConnection(async conn => conn);
        const isVaildTokenQuery = `select exists(select userId from users where userId = ? and declaration = 'Y' and status = 'Y') as exist;`;
        const [isVaildToken] = await connection.query(isVaildTokenQuery, userId);

        connection.release();
        return isVaildToken[0].exist
    } catch {
        return false;
    }
}

module.exports = {
    isValidUser,
    isDeclaredUser,
}