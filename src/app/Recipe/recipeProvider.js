const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const rcpDao = require("./recipeDao");

// 유통기한 임박한 상품 리스트 10개
exports.productDateLimit = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dataResult = await rcpDao.productDateLimit(connection, userId);
  connection.release();

  return dataResult;
};


exports.existRecipe = async function (userId, keyword) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dataResult = await rcpDao.existRecipe(connection, userId, keyword);
  connection.release();

  return dataResult;
};

// recipeId 리스트 조회
exports.retrieveRecipeId = async function (userId, keyword) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dataResult = await rcpDao.retrieveRecipeId(connection, userId, keyword);
  connection.release();

  return dataResult;
};

// 레시피 ID 유효성 존재
exports.selectRecipeID = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dataResult = await rcpDao.selectRecipeID(connection, userId, recipeId);
  connection.release();

  return dataResult;
};

// 레시피 Scrab 조회
exports.selectScrab = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dataResult = await rcpDao.selectScrab(connection, userId, recipeId);
  connection.release();

  return dataResult;
};


// status 조회
exports.selectScrabStatus = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.selectScrabStatus(connection, userId, recipeId);
  connection.release();

  return dateResult;
};

// 레시피 info 
exports.retrieveRecipeInfo = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeInfo(connection, userId, recipeId);
  connection.release();

  return dateResult;
};

// 매뉴얼 1
exports.retrieveRecipeManual1 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual1(connection, userId, recipeId);
  connection.release();

  return dateResult;
};

// 매뉴얼 2
exports.retrieveRecipeManual2 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual2(connection, userId, recipeId);
  connection.release();

  return dateResult;
};

// 매뉴얼 3
exports.retrieveRecipeManual3 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual3(connection, userId, recipeId);
  connection.release();

  return dateResult;
};

exports.retrieveRecipeManual4 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual4(connection, userId, recipeId);
  connection.release();

  return dateResult;
};

exports.retrieveRecipeManual5 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual5(connection, userId, recipeId);
  connection.release();

  return dateResult;
};

exports.retrieveRecipeManual6 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual6(connection, userId, recipeId);
  connection.release();

  return dateResult;
};

exports.retrieveRecipeManual7 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual7(connection, userId, recipeId);
  connection.release();

  return dateResult;
};

exports.retrieveRecipeManual8 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual8(connection, userId, recipeId);
  connection.release();

  return dateResult;
};

exports.retrieveRecipeManual9 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual9(connection, userId, recipeId);
  connection.release();

  return dateResult;
};

exports.retrieveRecipeManual10 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual10(connection, userId, recipeId);
  connection.release();

  return dateResult;
};
exports.retrieveRecipeManual11 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual11(connection, userId, recipeId);
  connection.release();

  return dateResult;
};
exports.retrieveRecipeManual11 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual11(connection, userId, recipeId);
  connection.release();

  return dateResult;
};
exports.retrieveRecipeManual12 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual12(connection, userId, recipeId);
  connection.release();

  return dateResult;
};
exports.retrieveRecipeManual13 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual13(connection, userId, recipeId);
  connection.release();

  return dateResult;
};
exports.retrieveRecipeManual14 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual14(connection, userId, recipeId);
  connection.release();

  return dateResult;
};
exports.retrieveRecipeManual15 = async function (userId, recipeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeManual15(connection, userId, recipeId);
  connection.release();

  return dateResult;
};

// 레시피 검색 
exports.retrieveRecipeProduct = async function (userId, product, page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveRecipeProduct(connection, userId, product, page, size);
  connection.release();

  return dateResult;
};

// 레시피 찜 조회
exports.retrieveJjimRecipe = async function (userId, page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const dateResult = await rcpDao.retrieveJjimRecipe(connection, userId, page, size);
  connection.release();

  return dateResult;
};