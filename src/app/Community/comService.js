const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const comProvider = require("./comProvider");
const comDao = require("./comDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.insertPost = async function (userId, title, category, postImgUrl1) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const communityResult = await comDao.insertPost(connection, userId, title, category, postImgUrl1);
        console.log(`추가된 포스팅 : ${communityResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - InsertPost Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
exports.insertPost1 = async function (userId, title, category, content1, postImgUrl1) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        await connection.beginTransaction()     // 트랜잭션 적용 시작
        const post = await comProvider.selectPostId(connection, userId, title, category);
        console.log(post.postId);

        var postId = post.postId;
        const communityResult1 = await comDao.insertPost1(connection, userId, postId, content1, postImgUrl1);
        await connection.commit()           //  트랜잭션 적용 끝 
        connection.release();
        return postId;


    } catch (err) {
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.rollback()
        connection.release();

        logger.error(`App - CommunityResult Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

exports.insertPost2 = async function (userId, postId, content2, postImgUrl2) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const communityResult = await comDao.insertPost2(connection, userId, postId, content2, postImgUrl2);
        console.log(`추가된 포스팅 : ${communityResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - InsertPost2 Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

exports.insertPost3 = async function (userId, postId, content3, postImgUrl3) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const communityResult = await comDao.insertPost3(connection, userId, postId, content3, postImgUrl3);
        console.log(`추가된 포스팅 : ${communityResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - InsertPost3 Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
exports.insertPost4 = async function (userId, postId, content4, postImgUrl4) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const communityResult = await comDao.insertPost4(connection, userId, postId, content4, postImgUrl4);
        console.log(`추가된 포스팅 : ${communityResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - InsertPost4 Service error\n: ${err.message}`);
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

// 찜 설정 및 해제
exports.addJjim = async function (userId, postId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        
        const jjimResult = await comDao.addJjim(connection, userId, postId);
        console.log(`추가된 포스팅 : ${jjimResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Add Jjim Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 찜 해제
exports.deleteJjim = async function (userId, postId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        
        const jjimResult = await comDao.deleteJjim(connection, userId, postId);
        console.log(`삭제된 포스팅 : ${jjimResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Delete Jjim Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 찜 설정
exports.updateJjim = async function (userId, postId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        
        const jjimResult = await comDao.updateJjim(connection, userId, postId);
        console.log(`수정된 포스팅 : ${jjimResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Update Jjim Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 조회수 증가
exports.addWatchCount = async function (userId, postId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        
        const watchResult = await comDao.addWatchCount(connection, userId, postId);
        console.log(`증가된 조회수 : ${watchResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Add Watch Count Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 글 수정 API
exports.updatePost1 = async function (userId, postId, title, category, content1, postImgUrl1) {
    try {
        var postId;
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.beginTransaction()     // 트랜잭션 적용 시작
        const communityResult = await comDao.updatePost(connection, userId, postId, title, category, postImgUrl1);
        const communityResult1 = await comDao.updatePost1(connection, userId, postId, content1, postImgUrl1);
        console.log(`수정된 글 : ${communityResult1.insertId}`)
        await connection.commit()           //  트랜잭션 적용 끝 
        connection.release();
        return ;


    } catch (err) {
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.rollback()
        connection.release();

        logger.error(`App - CommunityResult Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 게시글 신고
exports.insertDeclaration = async function (userId, postId, reason) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        
        const declarationResult = await comDao.insertDeclaration(connection, userId, postId, reason);
        console.log(`신고된 포스팅 : ${declarationResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Insert Declaration Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 해당 게시글에 대한 신고 수 조회
// 한 게시글의 신고 수 넘어가면
// 해당 글 삭제
// 유저 일주일 사용 정지
exports.afterWork = async function (postId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        await connection.beginTransaction()     // 트랜잭션 적용 시작

        const count = await comDao.retrieveDeclarationCount(connection, postId);

        // 해당 글 삭제 + 유저 일주일 사용 정지
        if(count.count > 5){
            const deleteResult = await comDao.deletePost(connection, postId);
            const deleteDetailResult = await comDao.deletePostContent(connection, postId);
            
            // postId를 작성한 사람 사용정지
            const searchId = await comDao.searchPostUser(connection, postId);
            var user = searchId[0].userId;
            const userStatus = await comDao.updateUserStatus(connection, user);
        }
        
        await connection.commit()           //  트랜잭션 적용 끝
        connection.release();
        return;


    } catch (err) {
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.rollback()
        connection.release();

        logger.error(`App - After Declaration Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 대댓글 삭제
exports.deleteReComment = async function (commentId)
{
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        
        const commentResult = await comDao.deleteReComment(connection, commentId);
        console.log(`대댓글 삭제 : ${commentResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Delete ReComment Count Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 댓글 삭제
exports.deleteComment = async function (commentId)
{
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        
        const commentResult = await comDao.deleteComment(connection, commentId);
        console.log(`댓글 삭제 : ${commentResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Delete Comment Count Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 글 삭제
exports.deletePost = async function (postId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.beginTransaction()     // 트랜잭션 적용 시작
        
        const postContentResult = await comDao.deletePostContent(connection, postId);
        const postResult = await comDao.deletePost(connection, postId);
        
        await connection.commit()           //  트랜잭션 적용 끝 
        connection.release();
        return ;


    } catch (err) {
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.rollback()
        connection.release();

        logger.error(`App - Delete Post Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};