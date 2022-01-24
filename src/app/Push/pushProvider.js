const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const pushDao = require("./pushDao");

exports.selectFriendByFriendId = async function (userId, friendId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const friendResult = await pushDao.selectFriendByFriendId(connection, userId, friendId);
  connection.release();

  return friendResult;
};

exports.selectStatus = async function (userId, friendId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const statusResult = await pushDao.selectStatus(connection, userId, friendId);
  connection.release();

  return statusResult;
};

  // 친구 목록 조회
exports.retrieveFriendList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await pushDao.retrieveFriendList(connection, userId);
  connection.release();

  return dateResult;
};

// 유통기한별로 유저 리스트
exports.selectPushAlarmUser = async function (day) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await pushDao.selectPushAlarmUser(connection, day);
  connection.release();

  return dateResult;
};


// 메세지 조회 
exports.selectMessage = async function (userId, day) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await pushDao.selectMessage(connection, userId, day);
  connection.release();

  return dateResult;
};