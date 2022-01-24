const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const rcpProvider = require("./recipeProvider");
const rcpDao = require("./recipeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// 레시피 추가
exports.insertRecipe = async function (userId, keyword, rcpNM, infoENG, infoCAR, infoPRO, infoFAT, infoNA, fileMain, ingredients) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const insertRecipe = await rcpDao.insertRecipe(connection, userId, keyword, rcpNM, infoENG, infoCAR, infoPRO, infoFAT, infoNA, fileMain, ingredients);
        console.log(`추가된 레시피 : ${insertRecipe.insertId}`)
        connection.release();
        return insertRecipe.insertId;


    } catch (err) {
        logger.error(`App - Insert Recipe Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 스크랩 추가
exports.addScrab = async function (userId, recipeId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const addScrab = await rcpDao.addScrab(connection, userId, recipeId);
        console.log(`추가된 스크랩 : ${addScrab.insertId}`)
        connection.release();
        return ;


    } catch (err) {
        logger.error(`App - Add Scrab Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 스크랩 삭제
exports.deleteScrab = async function (userId, recipeId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const deleteScrab = await rcpDao.deleteScrab(connection, userId, recipeId);
        console.log(`삭제된 스크랩 : ${deleteScrab.insertId}`)
        connection.release();
        return ;


    } catch (err) {
        logger.error(`App - Delete Scrab Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};

// 스크랩 수정
exports.updateScrab = async function (userId, recipeId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
 
        const updateScrab = await rcpDao.updateScrab(connection, userId, recipeId);
        console.log(`수정된 스크랩 : ${updateScrab.insertId}`)
        connection.release();
        return ;


    } catch (err) {
        logger.error(`App - Update Scrab Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};