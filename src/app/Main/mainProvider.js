const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const mainDao = require("./mainDao");


exports.selectSearchList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const listResult = await mainDao.selectSearchList(connection, userId);

  connection.release();
  return listResult;
};
// userId, count => fridgeId 추출
exports.retrieveFridgeCount = async function (userId, count) {
  const connection = await pool.getConnection(async (conn) => conn);
  const fridgeResult = await mainDao.retrieveFridgeCount(connection, userId, count);
  connection.release();

  return fridgeResult[0];
};

// 유통기한 날짜 => 일 조회
exports.selectExpirationDate = async function (expirationDate) {
    const connection = await pool.getConnection(async (conn) => conn);
    const dateResult = await mainDao.selectExpirationDate(connection, expirationDate);
    connection.release();

    return dateResult;
  };

// 냉장고 상세 화면 조회
exports.selectFridgeDetail = async function (userId, fridgeId, place, page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const fridgeResult = await mainDao.selectFridgeDetail(connection, userId, fridgeId, place, page, size);
  connection.release();

  return fridgeResult;
};

// 냉장고 전체 화면 조회
exports.selectFridgeHome1 = async function (userId, fridgeId, place, n1) {
  const connection = await pool.getConnection(async (conn) => conn);
  const fridgeResult = await mainDao.selectFridgeHome1(connection, userId, fridgeId, place, n1);
  connection.release();

  return fridgeResult;
};

exports.selectFridgeHome2 = async function (userId, fridgeId, place, n2) {
  const connection = await pool.getConnection(async (conn) => conn);
  const fridgeResult = await mainDao.selectFridgeHome2(connection, userId, fridgeId, place, n2);
  connection.release();

  return fridgeResult;
};

exports.selectFridgeHome3 = async function (userId, fridgeId, place, n3) {
  const connection = await pool.getConnection(async (conn) => conn);
  const fridgeResult = await mainDao.selectFridgeHome3(connection, userId, fridgeId, place, n3);
  connection.release();

  return fridgeResult;
};

exports.selectFridgeHome41 = async function (userId, fridgeId, place, n41) {
  const connection = await pool.getConnection(async (conn) => conn);
  const fridgeResult = await mainDao.selectFridgeHome41(connection, userId, fridgeId, place, n41);
  connection.release();

  return fridgeResult;
};

exports.selectFridgeHome423 = async function (userId, fridgeId, place, n423) {
  const connection = await pool.getConnection(async (conn) => conn);
  const fridgeResult = await mainDao.selectFridgeHome423(connection, userId, fridgeId, place, n423);
  connection.release();

  return fridgeResult;
};

exports.selectFridgeHome512 = async function (userId, fridgeId, place, n512) {
  const connection = await pool.getConnection(async (conn) => conn);
  const fridgeResult = await mainDao.selectFridgeHome512(connection, userId, fridgeId, place, n512);
  connection.release();

  return fridgeResult;
};

exports.selectFridgeHome534 = async function (userId, fridgeId, place, n534) {
  const connection = await pool.getConnection(async (conn) => conn);
  const fridgeResult = await mainDao.selectFridgeHome534(connection, userId, fridgeId, place, n534);
  connection.release();

  return fridgeResult;
};

exports.selectFridgeHome6 = async function (userId, fridgeId, place, n6) {
  const connection = await pool.getConnection(async (conn) => conn);
  const fridgeResult = await mainDao.selectFridgeHome6(connection, userId, fridgeId, place, n6);
  connection.release();

  return fridgeResult;
};

// 냉장고 place에 productId가 있는지
exports.existProductIdInPlace = async function (userId, fridgeId, place, productId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const fridgeResult = await mainDao.existProductIdInPlace(connection, userId, fridgeId, place, productId);
  connection.release();

  return fridgeResult;
};

// 식재료 상세 정보 조회
exports.productDetailInfo = async function (productId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const fridgeResult = await mainDao.productDetailInfo(connection, productId);
  connection.release();

  return fridgeResult;
};

// 식재료 속 정보 조회
exports.selectFridgeBySearch = async function (userId, search) {
  const connection = await pool.getConnection(async (conn) => conn);
  const fridgeResult = await mainDao.selectFridgeBySearch(connection, userId, search);
  connection.release();

  return fridgeResult;
};

// 영수증 인식 제한
exports.retrieveReceiptCount = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const receiptResult = await mainDao.retrieveReceiptCount(connection, userId);
  connection.release();

  return receiptResult;
};

// 내 검색어 search 조회
exports.existMySearch = async function (userId, search) {
  const connection = await pool.getConnection(async (conn) => conn);
  const searchResult = await mainDao.existMySearch(connection, userId, search);
  connection.release();

  return searchResult;
};

// 냉장고 선택
exports.selectFriendFridge = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const fridgeResult = await mainDao.selectFriendFridge(connection, userId);
  connection.release();

  return fridgeResult;
};