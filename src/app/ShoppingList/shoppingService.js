const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const shopProvider = require("./shoppingProvider");
const shopDao = require("./shoppingDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.insertList = async function (userId, product) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const shopListResult = await shopDao.insertListInfo(connection, userId, product);
        console.log(`추가된 식재료 : ${shopListResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - InsertList Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteList = async function (userId, listId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const shopListResult = await shopDao.deleteListInfo(connection, userId, listId);
        console.log(`삭제된 식재료 : ${shopListResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - InsertList Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
