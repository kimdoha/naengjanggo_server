const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const shopDao = require("./shoppingDao");

exports.existList = async function (userId, listId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const listResult = await shopDao.selectListId(connection, userId, listId);

  connection.release();

  return listResult[0];
};

exports.selectProductByListId = async function (userId, listId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productResult = await shopDao.selectProductByListId(connection, userId, listId);
  connection.release();

  return productResult[0];
};

// 오늘 장보기리스트 조회
exports.selectProductByToday = async function (userId, date) {
    const connection = await pool.getConnection(async (conn) => conn);
    await connection.beginTransaction(); 
    await shopDao.setVariable(connection);
    const productResult = await shopDao.selectProductByToday(connection, userId, date);
    await connection.commit();
    connection.release();
  
    return productResult;
  };
  

// 날짜별 장보기리스트 조회
exports.selectProductByMonth = async function (userId, date) {
  const connection = await pool.getConnection(async (conn) => conn);
  await connection.beginTransaction(); 
  await shopDao.setVariable(connection);
  const productResult = await shopDao.selectProductByMonth(connection, userId , date);
  await connection.commit();
  connection.release();

  return productResult;
};

// 날짜 조회
exports.selectDateByMonth = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const dateResult = await shopDao.selectDateByMonth(connection, userId);
    connection.release();

    return dateResult;
  };

// 오늘의 날짜 조회
exports.selectLatestDate = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await shopDao.selectLatestDate(connection, userId);
  connection.release();

  return dateResult;
};

// 장보기리스트 메세지 조회
exports.retrieveProductMessage = async function (userId, search) {
  const connection = await pool.getConnection(async (conn) => conn);
  const messageResult = await shopDao.retrieveProductMessage(connection, userId, search);
  connection.release();

  return messageResult;
};

// 해당 식재료 count 파악
exports.retrieveProductCount = async function (userId, search) {
  const connection = await pool.getConnection(async (conn) => conn);
  const messageResult = await shopDao.retrieveProductCount(connection, userId, search);
  connection.release();

  return messageResult;
};