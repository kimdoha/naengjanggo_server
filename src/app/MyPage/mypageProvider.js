const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const mypgDao = require("./mypageDao");

// 카테고리 내가 쓴 글 조회 
exports.selectMyPost = async function (userId, category, type, page, size){
    const connection = await pool.getConnection(async (conn) => conn);
    var dateResult;

    if(type == '최신순'){
        dateResult = await mypgDao.dataOrderByRecent(connection, category, userId, page, size);
    } else if(type == '조회순'){
        dateResult = await mypgDao.dataOrderByCount(connection, category, userId, page, size);
    } else if(type == '과거순'){
        dateResult = await mypgDao.dataOrderByOld(connection, category, userId, page, size);
    } else if(type == '좋아요순'){
        dateResult = await mypgDao.dataOrderByScrab(connection, category, userId, page, size);
    }

    connection.release();

    return dateResult;
};

// 유통기한 설정 수정
exports.existAlarm = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const alarmResult = await mypgDao.existAlarm(connection, userId);
  connection.release();

  return alarmResult;
};

// 댓글 및 유통기한 설정 조회 API
exports.selectMyAlarm = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await mypgDao.selectMyAlarm(connection, userId);
  connection.release();

  return dateResult;
};

// 냉장고 한개일 때는 삭제 불가
exports.totalFridgeCount = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const countResult = await mypgDao.totalFridgeCount(connection, userId);
    connection.release();
  
    return countResult[0];
  };