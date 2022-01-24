const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const mainProvider = require("./mainProvider");
const mainDao = require("./mainDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// 식재료 업로드
exports.insertProduct = async function (userId, fridgeId, productName, productCount, productDate, place) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        const registerDate = await mainDao.selectRegisterDate(connection, productDate);
        if(registerDate.length > 0){
            const finalDate = registerDate[0].date;
            const productResult = await mainDao.insertProduct(connection, userId, fridgeId, productName, place, finalDate, productCount);
        }
        connection.release();
        return;

    } catch (err) {
  
        logger.error(`App - Insert Product error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 식재료 삭제
exports.deleteProduct = async function (userId, fridgeId, place, productId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const deleteProduct = await mainDao.deleteProduct(connection, userId, fridgeId, place, productId);
        console.log(`삭제된 식재료 : ${deleteProduct.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Delete Product Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
// 식재료 수정
exports.updateProduct = async function (productId, productCount, productDate) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        const registerDate2 = await mainDao.selectRegisterDate(connection, productDate);
        if(registerDate2.length > 0){
            const finalDate = registerDate2[0].date;
            const updateProduct = await mainDao.updateProduct(connection, productId, productCount, finalDate);
            console.log(`수정된 식재료 : ${updateProduct.insertId}`)
        }
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Update Product Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 유통기한 제한
exports.receiptLimit = async function (userId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const receiptLimit = await mainDao.receiptLimit(connection, userId);
        console.log(`유통기한 제한 업로드  : ${receiptLimit.insertId}`)
        connection.release();
        return;


    } catch (err) {
        logger.error(`App - Receipt Limit Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};