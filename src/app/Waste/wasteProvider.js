const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const wasteDao = require("./wasteDao");

// 음쓰 유저 정보 조회
exports.existUserWasteInfo = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dataResult = await wasteDao.existUserWasteInfo(connection, userId);

  connection.release();
  return dataResult;
};

// 시작 날짜 및 종료 날짜 조회
exports.retrieveDate = async function (month) {
    const connection = await pool.getConnection(async (conn) => conn);
    const dataResult = await wasteDao.retrieveDate(connection, month);
  
    connection.release();
    return dataResult;
  };