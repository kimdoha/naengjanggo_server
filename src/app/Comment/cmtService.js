const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const cmtProvider = require("./cmtProvider");
const cmtDao = require("./cmtDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
// 댓글 작성
exports.postComment = async function (userId, postId, content) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const commentResult = await cmtDao.postComment(connection, userId, postId, content);
        console.log(`추가된 댓글 : ${commentResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Post Comment Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
// 대댓글 작성
exports.postReComment = async function (commentId, userId, content) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const commentResult = await cmtDao.postReComment(connection, commentId, userId, content);
        console.log(`추가된 대댓글 : ${commentResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Post ReComment Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
// 댓글 좋아요 API
exports.likeComment = async function (userId, commentId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const likeResult = await cmtDao.likeComment(connection, userId, commentId);
        console.log(`댓글 좋아요 포스팅 : ${likeResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Like Comment Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
// 대댓글 좋아요
exports.like2Comment = async function (userId, commentsId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const like2Result = await cmtDao.like2Comment(connection, userId, commentsId);
        console.log(`대댓글 좋아요 포스팅 : ${like2Result.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Like2 Comment Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
// 댓글 삭제
exports.deleteComment = async function (userId, commentId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const communityResult = await cmtDao.deleteComment(connection, userId, commentId);
        console.log(`삭제된 포스팅 : ${communityResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Delete Comment Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
// 대댓글 삭제
exports.deleteReComment = async function (userId, commentsId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const communityResult = await cmtDao.deleteReComment(connection, userId, commentsId);
        console.log(`삭제된 포스팅 : ${communityResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Delete ReComment Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
// 댓글 편집
exports.patchComment = async function (userId, commentId, content) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const communityResult = await cmtDao.patchComment(connection, userId, commentId, content);
        console.log(`수정된 포스팅 : ${communityResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Patch Comment Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
// 대댓글 편집
exports.patchReComment = async function (userId, content, commentsId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const communityResult = await cmtDao.patchReComment(connection, userId, content, commentsId);
        console.log(`추가된 포스팅 : ${communityResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Patch ReComment Service error\n: ${err.message}`);
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