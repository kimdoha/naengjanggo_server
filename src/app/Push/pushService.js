const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const pushrovider = require("./pushProvider");
const pushDao = require("./pushDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");


exports.addFriend = async function (userId, friendId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const friendResult = await pushDao.addFriend(connection, userId, friendId);
        console.log(`추가된 포스팅 : ${friendResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Add Friend Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

exports.patchFriend0 = async function (userId, friendId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const friendResult = await pushDao.patchFriend0(connection, userId, friendId);
        console.log(`삭제된 포스팅 : ${friendResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - PatchFriend Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

exports.patchFriend1 = async function (userId, friendId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const friendResult = await pushDao.patchFriend1(connection, userId, friendId);
        console.log(`삭제된 포스팅 : ${friendResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - PatchFriend Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
exports.insertPost5 = async function (userId, postId, content5, postImgUrl5) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const communityResult = await comDao.insertPost5(connection, userId, postId, content5, postImgUrl5);
        console.log(`추가된 포스팅 : ${communityResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - InsertPost4 Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
exports.insertPost6 = async function (userId, postId, content6, postImgUrl6) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const communityResult = await comDao.insertPost6(connection, userId, postId, content6, postImgUrl6);
        console.log(`추가된 포스팅 : ${communityResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - InsertPost4 Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

exports.insertPost7 = async function (userId, postId, content7, postImgUrl7) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const communityResult = await comDao.insertPost7(connection, userId, postId, content7, postImgUrl7);
        console.log(`추가된 포스팅 : ${communityResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - InsertPost7 Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

exports.insertPost8 = async function (userId, postId, content8, postImgUrl8) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const communityResult = await comDao.insertPost8(connection, userId, postId, content8, postImgUrl8);
        console.log(`추가된 포스팅 : ${communityResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - InsertPost8 Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

exports.insertPost9 = async function (userId, postId, content9, postImgUrl9) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const communityResult = await comDao.insertPost9(connection, userId, postId, content9, postImgUrl9);
        console.log(`추가된 포스팅 : ${communityResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - InsertPost9 Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

exports.insertPost10 = async function (userId, postId, content10, postImgUrl10) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        
        const communityResult = await comDao.insertPost10(connection, userId, postId, content10, postImgUrl10);
        console.log(`추가된 포스팅 : ${communityResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - InsertPost10 Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};