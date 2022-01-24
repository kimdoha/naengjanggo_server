const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
//const request = require("request");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");
const googleDao = require("./googleDao");
const user = require("../User/userDao");

// 구글 로그인
exports.googleLogin = async function (req, res) {
  const access_token = req.body.access_token;
  try {
    // async function getUserIdx(socialId) {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       const socialIdCheckRows = googleDao.socialIdCheck(socialId);
    //       resolve(socialIdCheckRows);
    //     }, 1000);
    //   });
    // }
    // async function getLatestUserIdx(socialId) {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       const latestUserIdxRows = googleDao.selectLatestUserIdx(socialId);
    //       resolve(latestUserIdxRows);
    //     }, 1000);
    //   });
    // }
    // async function getFirstFolderIdx(userIdx) {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       const firstFolderIdx = googleDao.selectFirstFolderIdx(userIdx);
    //       resolve(firstFolderIdx);
    //     }, 1000);
    //   });
    // }
    // async function insertGoogleUser(socialId, email) {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       const insertGoogleRows = googleDao.insertGoogleUser(socialId, email);
    //       resolve(insertGoogleRows);
    //     }, 1000);
    //   });
    // }
    const googleData = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`,
      function (error, response, body) {
        // console.log(body);
        resultJSON = JSON.parse(body);
        return resultJSON;
      }
    );
    if (!googleData.data.id) {
      return res.json({
        isSuccess: false,
        code: 2001,
        message: "유효하지 않은 access token 입니다",
      });
    } else {
      //데이터가 잘 있을 때
      let userIdx = await getUserIdx(googleData.data.id); //절대 숫자 아님
      if (!userIdx || !userIdx.length) {
          console.log(userIdx);
        //유저 정보가 없는 경우
        //await insertGoogleUser(googleData.data.id, googleData.data.email);
        //const latestUser = await getLatestUserIdx(googleData.data.id);
        let token = jwt.sign(
          { userIdx: latestUser[0].userIdx }, //일단 jwt에 유저인덱스만 담아놓음.
          secret_config.jwtsecret,
          { expiresIn: "365d", subject: "userInfo" }
        );
        const tokenInfo = jwt.verify(token, secret_config.jwtsecret);
        
 
        return res.json({
          isSuccess: true,
          code: 1000,
          message: "구글 회원가입 성공",
          result: {
            jwt: token,
            userIdx: latestUser[0].userIdx,
            member: "비회원",
          },
        });
      } else {
        //유저 정보가 있는 경우
        let token = jwt.sign(
          { userIdx: userIdx[0].userIdx }, //일단 jwt에 유저인덱스만 담아놓음.
          secret_config.jwtsecret,
          { expiresIn: "365d", subject: "userInfo" }
        );
        const tokenInfo = jwt.verify(token, secret_config.jwtsecret);
        return res.json({
          isSuccess: true,
          code: 1000,
          message: "구글 로그인 성공",
          result: {
            jwt: token,
            userIdx: userIdx[0].userIdx,
            member: "회원",
          },
        });
      }
    }
  } catch (error) {
    return res.json({
      isSuccess: false,
      code: 2000,
      message: "구글 로그인/회원가입 실패",
    });
  }
};