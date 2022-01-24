const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

//회원가입 
exports.createAppUser = async function (email, password, registration_token) {
    try {
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);
    
        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");
        
        const insertUserInfoParams = [ email, hashedPassword, registration_token ];

        const connection = await pool.getConnection(async (conn) => conn);
 
        const userIdResult = await userDao.insertAppUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();


        return response({ isSuccess: true, code: 1000, message: "자체 회원가입 성공 완료!"});

    } catch (err) {
        logger.error(`App - create App User Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};

// 자체 로그인
exports.postSignIn = async function (email, password) {
    try {
        
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1)
            return errResponse(baseResponse.USER_USERID_NOT_EXIST);


        const Email = emailRows[0].email;
        const userId = emailRows[0].userId;


        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

      
        const passwordRows = await userProvider.passwordCheck(Email, hashedPassword);
        if (passwordRows.length < 1) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userId,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userTB",
            } // 유효 기간 365일
        );

        return response({ "isSuccess": true, "code": 1000, "message": "자체 로그인 성공!" }, {'userId': userId, 'jwt': token});
    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR); // 아이디 또는 비번이 잘못되었습니다. 추가 
    }
};

// 카카오 회원가입
exports.createUser = async function (nickname, email, profileImg, kakaoId, registration_token) {
    try {

        const insertUserInfoParams = [nickname, email, profileImg, kakaoId , registration_token];

        const connection = await pool.getConnection(async (conn) => conn);
 
        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 네이버 회원가입
exports.createNaverUser = async function (nickname, email, profileImg, naverId, registration_token) {
    try {

        const insertUserInfoParams = [nickname, email, profileImg, naverId , registration_token ];

        const connection = await pool.getConnection(async (conn) => conn);
 
        const userIdResult = await userDao.insertNaverUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return userIdResult[0].insertId;


    } catch (err) {
        
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.setFridgeType = async function (userId, count, type) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        await connection.beginTransaction();

        const typeResult = await userDao.insertFridgeType(connection, userId, count, type);
        console.log(`추가된 냉장고 : ${typeResult}`)

        const [existActivate] = await userDao.selectNoActivate(connection, userId);
        // console.log(existActivate);
        if(existActivate[0].exist === 1){
            const insertAlarm = await userDao.insertAlarm(connection, userId);
            const setStatus = await userDao.setStatusActivate(connection, userId);
        }
        
        await connection.commit()
        connection.release();
        return;

    } catch (err) {
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.rollback();
        connection.release();

        logger.error(`App - SetFridgeType Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};


exports.setUserInfo = async function (userId, Name, Image) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        const userResult = await userDao.setUserInfo(connection, userId, Name, Image);
        console.log(`추가된 정보 : ${userResult}`)

        connection.release();
        return;

    } catch (err) {
        logger.error(`App - SetUserInfo Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 냉장고 수정 
exports.patchFridgeType = async function (userId, count, type) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        const typeResult = await userDao.patchFridgeType(connection, userId, count, type);
        console.log(`수정된 냉장고 : ${typeResult}`)

        connection.release();
        return;

    } catch (err) {
        logger.error(`App - PatchFridgeType Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 7일 이상 지난 신고 유저
exports.declarationUserAfter7days = async function (userId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");

        const userResult = await userDao.declarationUserAfter7days(connection, userId);
        if(userResult.length > 0){
            // 7일이 지났어
            const updateResult = await userDao.updateStatus(connection, userId);
            connection.release();
            return response({ "isSuccess": true, "code": 1000, "message":"JWT 토큰 검증 성공 + 신고 유저 정지 해제" });
        }
        // 그냥 탈퇴하거나 없는 유저인 경우 
        else 
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
                

    } catch (err) {

        logger.error(`App - Declaration User After 7days Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 등록 토큰 업데이트 
exports.updateToken = async function (userId, registration_token) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        const tokenResult = await userDao.updateToken(connection, userId, registration_token);
        console.log(`FCM토큰 업데이트 : ${tokenResult.insertId}`)

        connection.release();
        return;

    } catch (err) {
        logger.error(`App - Update Token Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};