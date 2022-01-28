const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const validation = require("../../../config/validation");
const { resFormat } = require("../../../config/response");

const admin = require("firebase-admin");
const AppleAuth = require("apple-auth");
const appleConfig = require("../../../config/appleConfig.json");
const path = require('path');
const auth = new AppleAuth(appleConfig, path.join(__dirname, `../../../config/${appleConfig.private_key_path}`));
const secret_config = require("../../../config/secret");

const axios = require("axios");
const request = require("https");

const regexEmail = require("regex-email");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


/**
 * update : 2022.01.18
 * API No. 0
 * API Name : 자체 회원가입 API
 * [POST] /sign-up
 *
 **/

exports.signUp = async function (req, res) {
  const { password, email, fcm_token } = req.body;

  // 비밀번호 정규화
  var regexPassword = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

  if (!email)
    return res.send(resFormat(false, 201, "이메일이 정의되지 않았습니다."));

  if (!password)
    return res.send(resFormat(false, 202, "비밀번호가 정의되지 않았습니다."));

  if (!fcm_token)
    return res.send(resFormat(false, 203, "fcm 토큰이 정의되지 않았습니다."));

  if (!regexEmail.test(email))
    return res.send(resFormat(false, 204, "이메일 형식이 올바르지 않습니다."));

  // 숫자+영문자+특수문자 조합으로 8자리 이상
  if (!regexPassword.test(password))
    return res.send(
      resFormat(false, 205, "비밀번호 형식이 올바르지 않습니다.")
    );

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const selectUserEmailQuery = `SELECT * 
                                    FROM User
                                    WHERE email = ? AND status != -1;`;
      const [emailRows] = await connection.query(selectUserEmailQuery, email);
      if (emailRows.length > 0)
        return res.send(resFormat(false, 301, "중복된 이메일입니다."));

      // 비밀번호 암호화
      const hashedPassword = await crypto
        .createHash("sha512")
        .update(password)
        .digest("hex");

      const insertUserInfoParams = [email, hashedPassword, fcm_token];

      const insertUserInfoQuery = `INSERT INTO User(email, idType, password , fcmToken) VALUES (?, 5 ,?, ?); `;
      await connection.query(insertUserInfoQuery, insertUserInfoParams);

      let responseData = resFormat(true, 100, "자체 회원가입 성공 완료!");
      connection.release();
      return res.json(responseData);
    } catch (err) {
      // await connection.rollback(); // ROLLBACK
      connection.release();
      logger.error(`App - User SignUp Ver1 Query error\n: ${err.message}`);
      return res.json(resFormat(false, 500, "User SignUp Ver1 Query error"));
    }
  } catch (err) {
    logger.error(`App - User SignUp Ver1 DB Connection error\n: ${err.message}`);
    return res.json(resFormat(false, 501, "User SignUp Ver1 DB Connection error"));
  }
};

/**
 * update : 2022.01.19
 * API No. 0
 * API Name : 자체 로그인 API
 * [POST] /sign-in
 *
 **/

exports.signIn = async function (req, res) {
  const { password, email } = req.body;

  // 비밀번호 정규화
  var regexPassword = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

  // 빈 값 체크
  if (!email)
    return res.send(resFormat(false, 201, "이메일이 정의되지 않았습니다."));

  if (!password)
    return res.send(resFormat(false, 202, "비밀번호가 정의되지 않았습니다."));

  // 정규표현식 체크
  if (!regexEmail.test(email))
    return res.send(resFormat(false, 203, "이메일 형식이 올바르지 않습니다."));

  if (!regexPassword.test(password))
    return res.send(
      resFormat(false, 204, "비밀번호 형식이 올바르지 않습니다.")
    );

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      // 이메일 여부 확인
      const getUserInfoQuery = `SELECT userId, email
                                FROM User
                                WHERE email = ? AND status = 'Y';`;
      const [userInfo] = await connection.query(getUserInfoQuery, email);
      if (userInfo.length < 1)
        return res.send(resFormat(false, 301, "해당 회원이 존재하지 않습니다."));

      const userId = userInfo[0].userId;
      const userEmail = userInfo[0].email;

      // 비밀번호 확인
      const hashedPassword = await crypto
        .createHash("sha512")
        .update(password)
        .digest("hex");

      const getExistUserQuery = `SELECT EXISTS(SELECT email, password
                                 FROM User
                                 WHERE email = ? AND password = ?) AS exist;
          `;
      const [getExistUser] = await connection.query(getExistUserQuery, [
        userEmail,
        hashedPassword,
      ]);
      if (!getExistUser[0].exist)
        return res.send(resFormat(false, 302, "잘못된 비밀번호입니다."));

      //토큰 생성 Service
      let token = await jwt.sign(
        {
          userId: userId,
          email: email,
        },
        secret_config.jwtsecret,
        {
          expiresIn: "365d",
          subject: "userTB",
        } // 유효 기간 365일
      );

      let responseData = resFormat(true, 100, "자체 로그인 성공!");
      responseData.result = { userId: userId, jwt: token };
      connection.release();
      return res.json(responseData);
    } catch (err) {
      // await connection.rollback(); // ROLLBACK
      connection.release();
      logger.error(`App - User SignIn Ver1 Query error\n: ${err.message}`);
      return res.json(resFormat(false, 500, "User SignIn Ver1 Query error"));
    }
  } catch (err) {
    logger.error(`App - User SignIn Ver1 DB Connection error\n: ${err.message}`);
    return res.json(resFormat(false, 501, "User SignIn Ver1 DB Connection error"));
  }
};

/**
 * update : 2022.01.19
 * API No. 1
 * API Name : 소셜로그인 API
 * [POST] /social-login
 *
 **/
exports.socialLogin = async function(req, res){
  const { accessToken, fcm_token } = req.body;
  const DEF_LOGIN_TYPE_LIST = ["kakao", "naver", "google", "apple"];
  const loginType = req.query.loginType;
  
  if(!loginType || !String(loginType))
    return res.send(resFormat(false, 201, "로그인 타입이 정의되지 않았습니다."));

  if(!accessToken)
    return res.send(resFormat(false, 202, "access token이 정의되지 않았습니다."));

  if(!fcm_token)
    return res.send(resFormat(false, 203, "fcm 토큰이 정의되지 않았습니다."));

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      let userEmail = "";
      let snsId;
      let checkValid = true;

      await connection.beginTransaction();
      switch (loginType) {

        // "KAKAO LOGIN"
        case DEF_LOGIN_TYPE_LIST[0]:

          await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
              Authorization: "Bearer " + accessToken ,
            },
          }).then(async function (response) {
            if(response.data.kakao_account){
              userEmail = response.data.kakao_account.email;
              snsId = response.data.id;
              logger.info(`[kakao-login]  userEmail : ${userEmail}   snsId : ${snsId}`);
            } else {
              checkValid = false;
            }
          }).catch(err => {
            checkValid = false;
            logger.error(`App - kakao login error\n code : ${err.response.data.code} msg : ${err.response.data.msg}`);
          })

          break;

        // "NAVER LOGIN"
        case DEF_LOGIN_TYPE_LIST[1]:
          await axios.get('https://openapi.naver.com/v1/nid/me', {
            headers: {
              Authorization: "Bearer " + accessToken ,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }).then(async function (response) {
            if(response.data.message === 'success'){
              userEmail = response.data.response.email;
              snsId = response.data.response.id;
              logger.info(`[naver-login]  userEmail : ${userEmail}   snsId : ${snsId}`);
            } else {
              checkValid = false;
            }
          }).catch(err => {
            checkValid = false;
            logger.error(`App - naver login error\n code : ${err.response.data.resultCode} msg : ${err.response.data.message}`);           
          })

          break;

        // "GOOGLE LOGIN"
        case DEF_LOGIN_TYPE_LIST[2]:
          try {
            await admin
            .auth()
            .verifyIdToken(accessToken)
            .then((decodedToken) => {
              console.log(decodedToken);
              userEmail = decodedToken.email;
              snsId = decodedToken.uid;
            })
          } catch (error) {
            checkValid = false;
          }
          break;

        // "APPLE LOGIN"
        case DEF_LOGIN_TYPE_LIST[3]:
          const response = await auth.accessToken(accessToken);
          console.log(response);
          if(!response){
            checkValid = false;

          } else {
            const idToken = jwt.decode(response.id_token);
            userEmail = idToken.email;
            snsId = idToken.sub;
            logger.info(`[apple-login]  userEmail : ${userEmail}   snsId : ${snsId}`);
          }

          break;

        default:
          await connection.rollback();
          connection.release();
          return res.send(resFormat(false, 202, "로그인 타입 에러입니다."))
      }

      if(!checkValid){
        await connection.rollback();
        connection.release();
        return res.send(resFormat(false, 301, "invalid access token"));
      }
      //exist user check
      //DB snsRoute, snsId 칼럼 추가
      const isExistUserQuery = ``;
      const userIdResult = await userDao.selectUserId(connection, kakaoId);
      connection.release();
 
         //console.log(userIdResult);
         //console.log(userIdResult.length);
 
         if (userIdResult.length < 1) {
           //회원가입
           const signupResult = await userService.createUser(
             nickname,
             email,
             profileImg,
             kakaoId,
             registration_token
           );
           userId = signupResult.insertId;
         } else {
           //console.log(userIdResult[0]);
           userId = userIdResult[0].userId;
           //console.log(userId);
         }
 
         //로그인
         let token = await jwt.sign(
           {
             userId: userId,
           }, // 토큰의 내용(payload)
           secret_config.jwtsecret, // 비밀키
           {
             expiresIn: "365d",
             subject: "userId",
           } // 유효 기간 365일
         );
 
         return res.send({
           isSuccess: true,
           code: 1000,
           message: "카카오 로그인 되었습니다!",
           result: { id: userId, jwt: token },
         });

      connection.release();
      return res.send(resFormat(true, 100, "소셜 로그인 성공!"));

    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      logger.error(`App - User Social-Login Query error\n: ${err.message}`);
      return res.json(resFormat(false, 500, "User Social-Login Query error"));
    }
  } catch (err) {
    logger.error(`App - User Social-Login DB Connection error\n: ${err.message}`);
    return res.json(resFormat(false, 501, "User Social-Login DB Connection error"));
  }
}

exports.appleLogin = async function (req, res) {
  const { code, registration_token } = req.body;

  if (!code) return res.send(errResponse(baseResponse.INPUT_APPLE_CODE));

  if (!registration_token)
    return res.send(errResponse(baseResponse.INPUT_REGISTRATION_TOKEN));

  let response = ``;
  let idToken = ``;

  const connection = await pool.getConnection();

  try {
    response = await auth.accessToken(code);
    idToken = jwt.decode(response.id_token);
    // console.log(response, idToken);
  } catch (err) {
    console.log(err);
    return res.send({
      isSuccess: false,
      code: 2000,
      message: "유효하지 않은 code입니다.",
    });
  }

  const email = idToken.email;
  const appleId = idToken.sub;
  // console.log(email, appleId);

  try {
    const socialIdCheckRows = await userDao.socialIdCheck(connection, appleId);
    // console.log(socialIdCheckRows);
    if (socialIdCheckRows.length > 0) {
      let token = await jwt.sign(
        {
          userId: socialIdCheckRows[0].userId,
        },
        secret_config.jwtsecret,
        {
          expiresIn: "365d",
          subject: "userInfo",
        }
      );

      return res.send({
        isSuccess: true,
        code: 1000,
        message: "애플 로그인 되었습니다!",
        result: { id: socialIdCheckRows[0].userId, jwt: token },
      });
    } else {
      const insertAppleUserRows = await userDao.insertAppleUser(
        connection,
        appleId,
        email,
        registration_token
      );
      let token = await jwt.sign(
        {
          userId: insertAppleUserRows.insertId,
        },
        secret_config.jwtsecret,
        {
          expiresIn: "365d",
          subject: "userInfo",
        }
      );
      return res.send({
        isSuccess: true,
        code: 1000,
        message: "애플 로그인 되었습니다!",
        result: { id: insertAppleUserRows.insertId, jwt: token },
      });
    }
  } catch (err) {
    console.log(err);
    return res.json(errResponse(baseResponse.APPLE_LOGIN_FAILURE));
  } finally {
    connection.release();
  }
};

/**
 * API No. 2
 * API Name : 카카오로그인 API
 * [POST] /kakao-login
 */

exports.kakaoLogin = async function (req, res) {
  const { accessToken, registration_token } = req.body;

  const api_url = "https://kapi.kakao.com/v2/user/me";
  var email, profileImg, nickname, kakaoId, userId;

  if (!accessToken) return res.send(errResponse(baseResponse.USER_TOKEN_EMPTY));

  if (!registration_token)
    return res.send(errResponse(baseResponse.INPUT_REGISTRATION_TOKEN));

  // id, email, profile, nickname
  try {
    axios({
      url: api_url,
      method: "get",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then(async function (response) {
        //console.log(response.data.kakao_account);
        kakaoId = response.data.id;
        email = response.data.kakao_account.email;
        profileImg = response.data.kakao_account.profile.profile_image_url;
        nickname = response.data.kakao_account.profile.nickname;

        if (!email) email = null;
        if (!profileImg) profileImg = null;
        if (!nickname) nickname = null;

        //console.log(kakaoId, email, profileImg, nickname);

        //이미 존재하는 유저인지 확인
        const connection = await pool.getConnection(async (conn) => conn);
        const userIdResult = await userDao.selectUserId(connection, kakaoId);
        connection.release();

        //console.log(userIdResult);
        //console.log(userIdResult.length);

        if (userIdResult.length < 1) {
          //회원가입
          const signupResult = await userService.createUser(
            nickname,
            email,
            profileImg,
            kakaoId,
            registration_token
          );
          userId = signupResult.insertId;
        } else {
          //console.log(userIdResult[0]);
          userId = userIdResult[0].userId;
          //console.log(userId);
        }

        //로그인
        let token = await jwt.sign(
          {
            userId: userId,
          }, // 토큰의 내용(payload)
          secret_config.jwtsecret, // 비밀키
          {
            expiresIn: "365d",
            subject: "userId",
          } // 유효 기간 365일
        );

        return res.send({
          isSuccess: true,
          code: 1000,
          message: "카카오 로그인 되었습니다!",
          result: { id: userId, jwt: token },
        });
      })
      .catch(function (error) {
        return res.send(errResponse(baseResponse.KAKAO_LOGIN_FAILURE));
      });
  } catch (err) {
    logger.error(`App - kakaoLogin error\n: ${err.message}`);
    return res.send(errResponse(baseResponse.KAKAO_LOGIN_FAILURE));
  }
};

/**
 * update : 2022.01.24
 * API No. 3
 * API Name :자동로그인 API
 * [POST] /auto-login
 */

// 자동 로그인
exports.autoLogin = async function (req, res) {
  const userId = req.verifiedToken.userId;
  const { fcm_token } = req.body;


  if (!fcm_token)
    return res.send(resFormat(false, 201, "fcm 토큰이 정의되지 않았습니다."));

    try {
      const connection = await pool.getConnection(async (conn) => conn);
      try {

        if(!(await validation.isValidUser(userId))){
          connection.release();
          return res.send(resFormat(false, 301, "존재하지 않는 유저입니다."));
        }

        await connection.beginTransaction();
        // 신고 당한 사람의 경우
        if(await validation.isDeclaredUser(userId)){
          const isUserDeclaredCheckQuery = `select distinct *
                                            from Notice n
                                            inner join User u on n.userId = u.userId
                                            where n.userId = ? AND u.declaration = 'Y' AND
                                            NOW() BETWEEN n.createAt AND DATE_ADD(n.createAt ,INTERVAL 7 DAY )
                                            order by n.createAt DESC
                                            limit 1;`;
          const [isUserDeclaredCheck] = await connection.query(isUserDeclaredCheckQuery , userId);
          if(isUserDeclaredCheck.length){
            // 신고 당한지 7일 지나기 전
            await connection.commit();
            connection.release();
            return res.send(resFormat(false, 302, "해당 유저는 7일 간 정지되었습니다."));
          } else {
            // 신고 당한 지 7일 지난 후

            const updateUserDeclarationQuery = `update User set declaration = 'N'
                                                where userId = ? and declaration = 'Y';`;
            await connection.query(updateUserDeclarationQuery, userId);
          }
        }
        const isChangedFcmTokenCheckQuery = `select exists(select * from User where userId = ? and fcmToken = ?) as exist;`;
        const [isChangedFcmTokenCheck] = await connection.query(isChangedFcmTokenCheckQuery, [ userId, fcm_token ] );
        if (!isChangedFcmTokenCheck[0].exist) {
          // fcm_token 변경
          const updateUserFcmTokenQuery = `update User set fcmToken = ? where userId = ?;`;
          await connection.query(updateUserFcmTokenQuery, [ fcm_token, userId ]);
    
        }

        let responseData = resFormat(true, 100, "JWT 토큰 검증 성공");
        await connection.commit();
        connection.release();
        return res.send(responseData);
      } catch (err) {
        await connection.rollback(); // ROLLBACK
        connection.release();
        logger.error(`App - post User Auto-Login Query error\n: ${err.message}`);
        return res.json(resFormat(false, 500, "post User Auto-Login Query error"));
      }
    } catch (err) {
      logger.error(`App - post User Auto-Login DB Connection error\n: ${err.message}`);
      return res.json(resFormat(false, 501, "post User Auto-Login DB Connection error"));
    }
};

/**
 * API No. 4
 * API Name : 네이버로그인 API
 * [POST] /naver-login
 */
exports.naverLogin = async function (req, res) {
  const { token, registration_token } = req.body;
  if (!token) return res.send(errResponse(baseResponse.USER_TOKEN_EMPTY));

  if (!registration_token)
    return res.send(errResponse(baseResponse.INPUT_REGISTRATION_TOKEN));

  const header = "Bearer " + token;

  const api_url = "https://openapi.naver.com/v1/nid/me";

  const options = {
    url: api_url,
    headers: { Authorization: header },
  };

  request.get(options, async function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const obj = JSON.parse(body);
      var naverId = obj.response.id;
      var email = obj.response.email;
      var profileImg = obj.response.profile_image;
      var nickname = obj.response.name;

      if (!email) email = null;
      if (!nickname) nickname = null;
      if (!profileImg) profileImg = null;

      //console.log(naverId, email, profileImg, nickname);

      //이미 존재하는 유저인지 확인
      const connection = await pool.getConnection(async (conn) => conn);
      const userIdResult = await userDao.selectUserNaverId(connection, naverId);
      connection.release();

      // console.log(userIdResult);
      // console.log(userIdResult.length);

      if (userIdResult.length < 1) {
        //회원가입
        const signupResult = await userService.createNaverUser(
          nickname,
          email,
          profileImg,
          naverId,
          registration_token
        );
        // console.log(signupResult);
        userId = signupResult;
      } else {
        // console.log(userIdResult[0]);
        userId = userIdResult[0].userId;
        // console.log(userId);
      }

      //로그인
      let token = await jwt.sign(
        {
          userId: userId,
        }, // 토큰의 내용(payload)
        secret_config.jwtsecret, // 비밀키
        {
          expiresIn: "365d",
          subject: "userId",
        } // 유효 기간 365일
      );

      return res.send({
        isSuccess: true,
        code: 1000,
        message: "네이버 로그인 되었습니다!",
        result: { id: userId, jwt: token },
      });
    } else {
      if (response != null) {
        return res.send(errResponse(baseResponse.NAVER_LOGIN_FAIL));
      }
    }
  });
};


/**
 * update : 2022.01.22
 * API No.10
 * API Name : [냉장고 수정 및 삭제 시] 냉장고 조회 API
 * [GET] /users/fridge
 */
exports.getFridgeInfo = async function (req, res) {
  const userId = req.verifiedToken.userId; // 내 아이디

    try {
      const connection = await pool.getConnection(async (conn) => conn);
      try {
        if(!(await validation.isValidUser(userId))){
          connection.release();
          return res.send(resFormat(false, 301, "존재하지 않는 유저입니다."));
        }

        if(await validation.isDeclaredUser(userId)){
          connection.release();
          return res.send(resFormat(false, 302, "신고당한 블랙 유저입니다."));
        }
        const getUserFridgeInfoQuery = `select fridgeId, userId, fridgeType
                                        from Fridge
                                        where userId = ? AND status = 'Y'
                                        order by createAt;`;
        const [getUserFridgeInfo] = await connection.query(getUserFridgeInfoQuery, userId);
        if (getUserFridgeInfo.length < 1){
          connection.release();
          return re.send(resFormat(false, 303, "냉장고가 존재하지 않습니다."))
        }
          
      
        let responseData = resFormat(true, 100, "냉장고 타입 조회 완료!");
        responseData.result = getUserFridgeInfo;
        connection.release();
        return res.json(responseData);
      } catch (err) {
        // await connection.rollback(); // ROLLBACK
        connection.release();
        logger.error(`App - get User Fridge Info Query error\n: ${err.message}`);
        return res.json(resFormat(false, 500, "get User Fridge Info Query error"));
      }
    } catch (err) {
      logger.error(`App - getUser Fridge Info Connection error\n: ${err.message}`);
      return res.json(resFormat(false, 501, "get User Fridge Info DB Connection error"));
    }

};

/**
 * update : 2022.01.23
 * API No.12
 * API Name : 냉장고 타입 추가 API
 * [POST] /users/fridge-type/:type
 */

exports.setFridge = async function (req, res) {
  const userId = req.verifiedToken.userId; // 내 아이디
  const type = req.params.type;

  if (!type || !Number(type) )
    return res.send(resFormat(false, 201, "타입 형식이 올바르지 않습니다."));

  if (type < 1 || type > 6) type = 1;

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      if(!(await validation.isValidUser(userId))){
        connection.release();
        return res.send(resFormat(false, 301, "존재하지 않는 유저입니다."));
      }

      if(await validation.isDeclaredUser(userId)){
        connection.release();
        return res.send(resFormat(false, 302, "신고당한 블랙 유저입니다."));
      }

      const getUserFridgeQuery = `select userId, fridgeType
                                  from Fridge
                                  where userId = ? AND status = 'Y'
                                  order by createAt;`;
      const [fridgeList] = await connection.query(getUserFridgeQuery, userId);

      const count = fridgeList.length + 1;
      if (count > 4) 
        return res.send(resFormat(false, 303, "설정 가능한 냉장고 수를 초과했습니다."));

      await connection.beginTransaction();
      // 냉장고 설정
      const insertFridgeQuery = `insert into Fridge(userId, fridgeType) VALUES (?, ?);`;
      const [insertFridge] = await connection.query(insertFridgeQuery, [ userId, type ]);
      
      let responseData = resFormat(true, 100, "냉장고 타입 설정 완료!");
      responseData.result = { 
                              id: insertFridge.insertId, 
                              userId: userId, 
                              count: count, 
                              fridge: Number(type) 
                            };

      await connection.commit();
      connection.release();
      return res.json(responseData);
    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      logger.error(`App - add User Fridge Query error\n: ${err.message}`);
      return res.json(resFormat(false, 500, "add User Fridge Query error"));
    }
  } catch (err) {
    logger.error(`App - add User Fridge Connection error\n: ${err.message}`);
    return res.json(resFormat(false, 501, "add User Fridge Connection error"));
  }
};

/**
 * update : 2022.01.23
 * API No.11
 * API Name : 닉네임 / 이미지 수정 API
 * [PATCH] /users/setinfo
 */

exports.setUserInfo = async function (req, res) {
  const userId = req.verifiedToken.userId; // 내 아이디
  const { nickname, profileImg } = req.body;
  let userName, userImage;

  if (!nickname)
    return res.send(resFormat(false, 201, "닉네임이 정의되지 않았습니다."))

  // 닉네임 validation 
  var nickname_pattern = /^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{2,20}$/;

  if (!nickname_pattern.test(nickname))
    return res.send(resFormat(false, 202, "닉네임 형식이 올바르지 않습니다."))

  var image_pattern = /^([\S]+((i?).(jpg|png|jpeg|bmp)))/;
  
  // 프로필 이미지 형식
  if (!profileImg){
    userImage = null;
  }
  else {
    if (!image_pattern.test(profileImg) || !String(profileImg))
      return res.send(resFormat(false, 203, "프로필 이미지 형식이 올바르지 않습니다."));

    userImage = profileImg;
  }

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      if(!(await validation.isValidUser(userId))){
        connection.release();
        return res.send(resFormat(false, 301, "존재하지 않는 유저입니다."));
      }

      if(await validation.isDeclaredUser(userId)){
        connection.release();
        return res.send(resFormat(false, 302, "신고당한 블랙 유저입니다."));
      }
      // 닉네임 중복 확인
      const getDuplicationNameQuery = `select exists(select * from User where nickName = ?) as exist;`;
      const [getDuplicationName] = await connection.query(getDuplicationNameQuery, nickname);
      if (getDuplicationName[0].exist)
        return res.send(resFormat(false, 303, "이미 존재하는 닉네임입니다."));
    
      userName = nickname;

      connection.beginTransaction();
      // update profileImg && nickname
      const updateUserInfoQuery = `update User set nickName = ?, profileImg = ? 
                                   where userId = ?;`;
      await connection.query(updateUserInfoQuery, [ userName, userImage, userId ]);


      let responseData = resFormat(true, 100, "닉네임 및 프로필이미지 수정완료!");
      responseData.result = {nickname: userName, profileImg: userImage };
      
      await connection.commit();
      connection.release();
      return res.json(responseData);

    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      logger.error(`App - patch User Info Query error\n: ${err.message}`);
      return res.json(resFormat(false, 500, "patch User Info Query error"));
    }
  }catch (err) {
    logger.error(`App - patch User Info DB Connection error\n: ${err.message}`);
    return res.json(resFormat(false, 501, "patch User Info DB Connection error"));
  }
};

/**
 * API No. 13
 * API Name : 닉네임 / 이미지 조회 API
 * [GET] /users/nickname?search =
 */

exports.searchUser = async function (req, res) {
  const userId = req.verifiedToken.userId; // 내 아이디
  let { search } = req.query;

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      if(!(await validation.isValidUser(userId))){
        connection.release();
        return res.send(resFormat(false, 301, "존재하지 않는 유저입니다."));
      }

      if(await validation.isDeclaredUser(userId)){
        connection.release();
        return res.send(resFormat(false, 302, "신고당한 블랙 유저입니다."));
      }

      let userInfo;
      const searchUserInfoQuery = `select userId, nickName, profileImg
                                   from User
                                   where userId = ? AND status = 'Y';`;

      const searchUserInfoByNickNameQuery = `select userId, nickName, profileImg
                                             from User
                                             where nickname = ? AND status = 'Y';`;
      if(!search){
        // 나의 정보 조회
        [userInfo] = await connection.query(searchUserInfoQuery, userId);
      } else {
        // 다른 사용자 정보조회
        if (!String(search)){
          connection.release();
          return res.send(resFormat(false, 201, "입력 형식이 올바르지 않습니다."));
        }
        [userInfo] = await connection.query(searchUserInfoByNickNameQuery, search);
      }
      
      if(userInfo.length < 1){
        connection.release();
        return res.send(resFormat(false, 303, "조회되지 않는 유저입니다."));
      }
      let responseData = resFormat(true, 100, "닉네임 및 프로필 이미지 조회 완료!");
      responseData.result = userInfo;
      connection.release();
      return res.json(responseData);
    } catch (err) {
      // await connection.rollback(); // ROLLBACK
      connection.release();
      logger.error(`App - get UserNickName && ProfileImg Query error\n: ${err.message}`);
      return res.json(resFormat(false, 500, "get UserNickName && ProfileImg Query error"));
    }
  } catch (err) {
    logger.error(`App - get UserNickName && ProfileImg DB Connection error\n: ${err.message}`);
    return res.json(resFormat(false, 501, "get UserNickName && ProfileImg DB Connection error"));
  }
};
