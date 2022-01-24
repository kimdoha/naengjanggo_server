const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// 이메일 중복 체크 
exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.emailCheck(connection, email);
  connection.release();

  return userResult;
};


// 닉네임 체크
exports.nicknameCheck = async function (nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const nameCheckResult = await userDao.selectUserNickname(connection, nickname);
  connection.release();

  return nameCheckResult;
};

// 자체 로그인
exports.passwordCheck = async function (Email, hashedPassword) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(connection, Email, hashedPassword );
  
  connection.release();
  return passwordCheckResult;
};



exports.selectUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUser(connection, userId);

  connection.release();

  return userResult[0];
};


exports.selectUserByNickname = async function (search) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserByNickname(connection, search);

  connection.release();

  return userResult[0];
};

// 냉장고 타입 설정
exports.selectFridgeCount = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const cntResult = await userDao.selectFridgeCount(connection, userId);
  connection.release();

  return cntResult;
};

// 냉장고 타입 수정
exports.existFridgeCount = async function (userId, count) {
  const connection = await pool.getConnection(async (conn) => conn);
  const existResult = await userDao.existFridgeCount(connection, userId, count);
  connection.release();

  return existResult;
};

// 활성화된 유저인지 체크
exports.checkUserStatus = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.checkUserStatus(connection, userId);

  connection.release();

  return userResult[0];
};

// 신고당한 유저인지 체크
exports.declarationCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.declarationCheck(connection, userId);

  connection.release();

  return userResult[0];
};

// 내가 userId의 친구인지 확인
exports.checkFriendStatus = async function (myId, userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.checkFriendStatus(connection, myId, userId);

  connection.release();

  return userResult[0];
};

// 등록 토큰 비교
exports.differentToken = async function (userId, registration_token) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.differentToken(connection, userId, registration_token);

  connection.release();

  return userResult;
};

// myId-userId 확인
exports.checkFriendStatus2 = async function (myId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.checkFriendStatus2(connection, myId);

  connection.release();

  return userResult;
};