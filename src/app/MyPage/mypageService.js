const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const mypgProvider = require("./mypageProvider");
const mypgDao = require("./mypageDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// 유통기한 알림 생성
exports.createUserShelfLifeAlarm = async function (paramsForUserShelfLife) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const createUserShelfLifeAlarmQuery = `INSERT INTO Alarm(userId, dateDiff) VALUES(?, ?)`;
        await connection.query(createUserShelfLifeAlarmQuery, paramsForUserShelfLife);
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Service error\n: ${err.message}`);
        throw(err);
    }
};


// 유통기한 알림 설정 On / OFF
exports.updateDateOn = async function (alarm) {
    try {
        let responseData;
        const connection = await pool.getConnection(async (conn) => conn);
 
        if(alarm == 'Y'){
            const patchUserShelfLifeAlarmOffQuery = `UPDATE Alarm 
                                                    SET shelfLifeAlarm = 'N'
                                                    WHERE shelfLifeAlarm = 'Y' AND userId = ?;`;

            await connection.query(patchUserShelfLifeAlarmOffQuery, userId );
            responseData = resFormat(true, 100, "유통기한 알림 OFF 완료!" );

        } else {
            const patchUserShelfLifeAlarmOnQuery = `UPDATE Alarm 
                                                    SET shelfLifeAlarm = 'Y', dateDiff = ?
                                                    WHERE shelfLifeAlarm = 'N' AND userId = ?;`;

            await connection.query(patchUserShelfLifeAlarmOnQuery, [ day, userId ]);
            responseData = resFormat(true, 100, "유통기한 알림 ON + 수정 완료!" );
        } 
        connection.release();
        return responseData;


    } catch (err) {
        logger.error(`App - Update Date On Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// day를 수정
exports.updateDate = async function (userId, day) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const updateResult = await mypgDao.updateDate(connection, userId, day);
        console.log(`수정된 포스팅 : ${updateResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Update Date Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
// 댓글 알림 OFF
exports.updateCommentOff = async function (userId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const updateResult = await mypgDao.updateCommentOff(connection, userId);
        console.log(`수정된 포스팅 : ${updateResult.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Update Comment Off Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 댓글 알림 ON
exports.updateCommentOn = async function (userId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const updateResult = await mypgDao.updateCommentOn(connection, userId);
        console.log(`수정된 포스팅 : ${updateResult.insertId}`);
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Update Comment On Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 냉장고 타입 변경
exports.changeFridge = async function (userId, fridgeId, count, type) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        
        await connection.beginTransaction()     // 트랜잭션 적용 시작

        const fridgeResult = await mypgDao.changeFridge(connection, userId, fridgeId);
        const changeType = await mypgDao.changeType(connection, userId, fridgeId, count, type);
        console.log(`냉장고 타입 변경 : ${fridgeResult.insertId}`)
        console.log(`냉장고 타입 변경 : ${changeType.insertId}`)
        
        await connection.commit()           //  트랜잭션 적용 끝 
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Change Fridge Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 냉장고 삭제 
exports.deleteFridge = async function (userId, fridgeId, count) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        
        await connection.beginTransaction()     // 트랜잭션 적용 시작
        const fridgeResult1 = await mypgDao.changeFridge(connection, userId, fridgeId);
        const fridgeResult2 = await mypgDao.deleteFridge(connection, userId, fridgeId);

        console.log(`냉장고 삭제1 : ${fridgeResult1.affectedRows}`)
        console.log(`냉장고 삭제2 : ${fridgeResult2.affectedRows}`)
    
        await connection.commit()           //  트랜잭션 적용 끝 
        connection.release();
        
        return;

    } catch (err) {
        logger.error(`App - Delete Fridge Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};


