//const request = require('request');
const { pool } = require("../../../config/database");

const jwtMiddleware = require("../../../config/jwtMiddleware");
const rcpProvider = require("./recipeProvider");
const rcpService = require("./recipeService");
const rcpDao = require("./recipeDao");
const userProvider = require("../User/userProvider");

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const { connect } = require("http2");

const regexEmail = require("regex-email");
const {emit, addListener} = require("nodemon");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");
const { logger } = require("../../../config/winston");
require('dotenv').config()

/**
 * API No. 58.
 * API Name : 레시피 조회 API
 * [GET] /user/recipe
 * 
 */
 exports.getUserRecipe = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    let { page } = req.query;
    const size = 120;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));


    // 유통기한이 임박한 상품 10개
    const productList = await rcpProvider.productDateLimit(userId);
    if(productList.length < 1)
        return res.send(errResponse(baseResponse.PRODUCT_DATE_LIMIT));
    
    if(!page)
        return res.send(response(baseResponse.NO_EMPTY_PAGE));

    if(page == 0)
        return res.send(response(baseResponse.INPUT_PAGE_RANGE));
    
    page = size * (page-1);

    const rp = require("request-promise");
    
    const totalData = [];

    const recipeIdList = [];

    async function saveRecipe(productList) {
        for (const product of productList) {

            const startIdx = 1;   // 현재 페이지
            const endIdx = 20;    // 페이지당 출력 개수
            const dataType = "json";
            const keyId = process.env.RECIPE_KEY_ID;
            const serviceId = "COOKRCP01";
            const keyword = product.productName;

            const existRecipe = await rcpProvider.existRecipe(userId, keyword);
            if(existRecipe.length < 1) { 
                
                const options = {
                    uri: "http://openapi.foodsafetykorea.go.kr/api/"+keyId+"/"+serviceId+"/"+dataType+"/"+startIdx+"/"+endIdx+"/RCP_NM="+encodeURI(keyword)+"&RCP_PARTS_DTLS="+encodeURI(keyword),
                    method: "GET"
                }
            
                const cb = await rp(options);
                var recipeObj = JSON.parse(cb);
        

                if(recipeObj.COOKRCP01.RESULT.MSG == '정상처리되었습니다.'){
                    for (const recipe of recipeObj.COOKRCP01.row) {

                        const rcpNM = recipe.RCP_NM;
                        const infoENG = recipe.INFO_ENG;
                        const infoCAR = recipe.INFO_CAR;
                        const infoPRO = recipe.INFO_PRO;
                        const infoFAT = recipe.INFO_FAT;
                        const infoNA = recipe.INFO_NA;
                        const fileMain = recipe.ATT_FILE_NO_MAIN;
                        const ingredients = recipe.RCP_PARTS_DTLS;


                        const recipeId = await rcpService.insertRecipe(userId, keyword, rcpNM, infoENG, infoCAR, infoPRO, infoFAT, infoNA, fileMain, ingredients);
                        recipeIdList.push(recipeId);

                        if (recipe.MANUAL01 != '' || recipe.MANUAL_IMG01 != ''){
                            let manual1 = ``;
                            let manualImg1 = ``;
                            if(recipe.MANUAL01 != '' && recipe.MANUAL_IMG01 != ''){
                                manual1 = recipe.MANUAL01;
                                manualImg1 = recipe.MANUAL_IMG01;
                            } else if(recipe.MANUAL01 != ''){
                                manual1 = recipe.MANUAL01;
                            } else {
                                manualImg1 = recipe.MANUAL_IMG01
                            } 

                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe1(connection, userId, recipeId, manual1, manualImg1);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe1 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }
                        } 

                        if (recipe.MANUAL02 != '' || recipe.MANUAL_IMG02 != ''){
                            
                            let manual2 = ``;
                            let manualImg2 = ``;
                            if(recipe.MANUAL02 != '' && recipe.MANUAL_IMG02 != ''){
                                manual2 = recipe.MANUAL02;
                                manualImg2 = recipe.MANUAL_IMG02;
                            } else if(recipe.MANUAL02 != ''){
                                manual2 = recipe.MANUAL02;
                            } else {
                                manualImg2 = recipe.MANUAL_IMG02
                            } 

                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe2(connection, userId, recipeId, manual2, manualImg2);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe2 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }

                        } if(recipe.MANUAL03 != '' || recipe.MANUAL_IMG03 != ''){
                            
                            // const manual3 = recipe.MANUAL03;
                            // const manualImg3 = recipe.MANUAL_IMG03;
                            let manual3 = ``;
                            let manualImg3 = ``;
                            if(recipe.MANUAL03 != '' && recipe.MANUAL_IMG03 != ''){
                                manual3 = recipe.MANUAL03;
                                manualImg3 = recipe.MANUAL_IMG03;
                            } else if(recipe.MANUAL03 != ''){
                                manual3 = recipe.MANUAL03;
                            } else {
                                manualImg3 = recipe.MANUAL_IMG03
                            } 

                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe3(connection, userId, recipeId, manual3, manualImg3);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe3 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }


                        } if(recipe.MANUAL04 != '' || recipe.MANUAL_IMG04 != '') {
                            
                            // const manual4 = recipe.MANUAL04;
                            // const manualImg4 = recipe.MANUAL_IMG04;

                            let manual4 = ``;
                            let manualImg4 = ``;
                            if(recipe.MANUAL04 != '' && recipe.MANUAL_IMG04 != ''){
                                manual4 = recipe.MANUAL04;
                                manualImg4 = recipe.MANUAL_IMG04;
                            } else if(recipe.MANUAL04 != ''){
                                manual4 = recipe.MANUAL04;
                            } else {
                                manualImg4 = recipe.MANUAL_IMG04
                            } 

                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe4(connection, userId, recipeId, manual4, manualImg4);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe4 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }


                        } if(recipe.MANUAL05 != '' || recipe.MANUAL_IMG05 != ''){
                            
                            // const manual5 = recipe.MANUAL05;
                            // const manualImg5 = recipe.MANUAL_IMG05;
  
                            let manual5 = ``;
                            let manualImg5 = ``;
                            if(recipe.MANUAL05 != '' && recipe.MANUAL_IMG05 != ''){
                                manual5 = recipe.MANUAL05;
                                manualImg5 = recipe.MANUAL_IMG05;
                            } else if(recipe.MANUAL05 != ''){
                                manual5 = recipe.MANUAL05;
                            } else {
                                manualImg5 = recipe.MANUAL_IMG05
                            } 

                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe5(connection, userId, recipeId, manual5, manualImg5);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe5 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }


                        } if(recipe.MANUAL06 != '' || recipe.MANUAL_IMG06 != ''){
                            
                            // const manual6 = recipe.MANUAL06;
                            // const manualImg6 = recipe.MANUAL_IMG06;

                            let manual6 = ``;
                            let manualImg6 = ``;
                            if(recipe.MANUAL06 != '' && recipe.MANUAL_IMG06 != ''){
                                manual6 = recipe.MANUAL06;
                                manualImg6 = recipe.MANUAL_IMG06;
                            } else if(recipe.MANUAL06 != ''){
                                manual6 = recipe.MANUAL06;
                            } else {
                                manualImg6 = recipe.MANUAL_IMG06
                            } 


                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe6(connection, userId, recipeId, manual6, manualImg6);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe6 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }

                        } if(recipe.MANUAL07 != '' || recipe.MANUAL_IMG07 != ''){
                            
                            // const manual7 = recipe.MANUAL07;
                            // const manualImg7 = recipe.MANUAL_IMG07;

                            let manual7 = ``;
                            let manualImg7 = ``;
                            if(recipe.MANUAL07 != '' && recipe.MANUAL_IMG07 != ''){
                                manual7 = recipe.MANUAL07;
                                manualImg7 = recipe.MANUAL_IMG07;
                            } else if(recipe.MANUAL07 != ''){
                                manual7 = recipe.MANUAL07;
                            } else {
                                manualImg7 = recipe.MANUAL_IMG07
                            } 

                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe7(connection, userId, recipeId, manual7, manualImg7);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe7 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }


                        } if(recipe.MANUAL08 != '' || recipe.MANUAL_IMG08 != ''){
                            
                            // const manual8 = recipe.MANUAL08;
                            // const manualImg8 = recipe.MANUAL_IMG08;

                            let manual8 = ``;
                            let manualImg8 = ``;
                            if(recipe.MANUAL08 != '' && recipe.MANUAL_IMG08 != ''){
                                manual8 = recipe.MANUAL08;
                                manualImg8 = recipe.MANUAL_IMG08;
                            } else if(recipe.MANUAL08 != ''){
                                manual8 = recipe.MANUAL08;
                            } else {
                                manualImg8 = recipe.MANUAL_IMG08
                            } 

                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe8(connection, userId, recipeId, manual8, manualImg8);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe8 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }

                        } if(recipe.MANUAL09 != '' || recipe.MANUAL_IMG09 != ''){
                            
                            // const manual9 = recipe.MANUAL09;
                            // const manualImg9 = recipe.MANUAL_IMG09;

                            let manual9 = ``;
                            let manualImg9 = ``;
                            if(recipe.MANUAL09 != '' && recipe.MANUAL_IMG09 != ''){
                                manual9 = recipe.MANUAL09;
                                manualImg9 = recipe.MANUAL_IMG09;
                            } else if(recipe.MANUAL09 != ''){
                                manual9 = recipe.MANUAL09;
                            } else {
                                manualImg9 = recipe.MANUAL_IMG09
                            } 

                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe9(connection, userId, recipeId, manual9, manualImg9);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe9 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }

                        } if(recipe.MANUAL10 != '' || recipe.MANUAL_IMG10 != ''){
                            
                            // const manual10 = recipe.MANUAL10;
                            // const manualImg10 = recipe.MANUAL_IMG10;

                            let manual10 = ``;
                            let manualImg10 = ``;
                            if(recipe.MANUAL10 != '' && recipe.MANUAL_IMG10 != ''){
                                manual10 = recipe.MANUAL10;
                                manualImg10 = recipe.MANUAL_IMG10;
                            } else if(recipe.MANUAL10 != ''){
                                manual10 = recipe.MANUAL10;
                            } else {
                                manualImg10 = recipe.MANUAL_IMG10
                            } 

                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe10(connection, userId, recipeId, manual10, manualImg10);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe10 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }


                        } if(recipe.MANUAL11 != '' || recipe.MANUAL_IMG11 != ''){
                            
                            // const manual11 = recipe.MANUAL11;
                            // const manualImg11 = recipe.MANUAL_IMG11;

                            let manual11 = ``;
                            let manualImg11 = ``;
                            if(recipe.MANUAL11 != '' && recipe.MANUAL_IMG11 != ''){
                                manual11 = recipe.MANUAL11;
                                manualImg11 = recipe.MANUAL_IMG11;
                            } else if(recipe.MANUAL11 != ''){
                                manual11 = recipe.MANUAL11;
                            } else {
                                manualImg11 = recipe.MANUAL_IMG11
                            } 


                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe11(connection, userId, recipeId, manual11, manualImg11);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe11 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }


                        } if(recipe.MANUAL12 != '' || recipe.MANUAL_IMG12 != ''){
                            
                            // const manual12 = recipe.MANUAL12;
                            // const manualImg12 = recipe.MANUAL_IMG12;

                            let manual12 = ``;
                            let manualImg12 = ``;
                            if(recipe.MANUAL12 != '' && recipe.MANUAL_IMG12 != ''){
                                manual12 = recipe.MANUAL12;
                                manualImg12 = recipe.MANUAL_IMG12;
                            } else if(recipe.MANUAL12 != ''){
                                manual12 = recipe.MANUAL12;
                            } else {
                                manualImg12 = recipe.MANUAL_IMG12
                            } 

                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe12(connection, userId, recipeId, manual12, manualImg12);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe12 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }

                        } if(recipe.MANUAL13 != '' || recipe.MANUAL_IMG13 != ''){
                           
                            let manual13 = ``;
                            let manualImg13 = ``;
                            if(recipe.MANUAL13 != '' && recipe.MANUAL_IMG13 != ''){
                                manual13 = recipe.MANUAL13;
                                manualImg13 = recipe.MANUAL_IMG13;
                            } else if(recipe.MANUAL13 != ''){
                                manual13 = recipe.MANUAL13;
                            } else {
                                manualImg13 = recipe.MANUAL_IMG13
                            } 

                            // const manual13 = recipe.MANUAL13;
                            // const manualImg13 = recipe.MANUAL_IMG13;

                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe13(connection, userId, recipeId, manual13, manualImg13);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe13 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }


                        } if(recipe.MANUAL14 != '' || recipe.MANUAL_IMG14 != ''){
                            
                            // const manual14 = recipe.MANUAL14;
                            // const manualImg14 = recipe.MANUAL_IMG14;
                            
                            let manual14 = ``;
                            let manualImg14 = ``;
                            if(recipe.MANUAL14 != '' && recipe.MANUAL_IMG14 != ''){
                                manual14 = recipe.MANUAL14;
                                manualImg14 = recipe.MANUAL_IMG14;
                            } else if(recipe.MANUAL14 != ''){
                                manual14 = recipe.MANUAL14;
                            } else {
                                manualImg14 = recipe.MANUAL_IMG14
                            } 

                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe14(connection, userId, recipeId, manual14, manualImg14);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe14 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }

                        } if(recipe.MANUAL15 != '' || recipe.MANUAL_IMG15 != ''){
                            
                            // const manual15 = recipe.MANUAL15;
                            // const manualImg15 = recipe.MANUAL_IMG15;

                            let manual15 = ``;
                            let manualImg15 = ``;
                            if(recipe.MANUAL15 != '' && recipe.MANUAL_IMG15 != ''){
                                manual15 = recipe.MANUAL15;
                                manualImg15 = recipe.MANUAL_IMG15;
                            } else if(recipe.MANUAL15 != ''){
                                manual15 = recipe.MANUAL15;
                            } else {
                                manualImg15 = recipe.MANUAL_IMG15
                            } 

                            try {
                                const connection = await pool.getConnection(async (conn) => conn);
                         
                                const recipeResult = await rcpDao.updateRecipe15(connection, userId, recipeId, manual15, manualImg15);
                                console.log(`수정된 레시피 : ${recipeResult.insertId}`)
                                connection.release();                     
                        
                            } catch (err) {
                                logger.error(`App - Update Recipe15 Service error\n: ${err.message}`);
                                return res.send(errResponse(baseResponse.DB_ERROR));
                            }


                        }

                    }
                }
            } else {
                const recipe = await rcpProvider.retrieveRecipeId(userId, keyword);
                for (const rcp of recipe) {
                    recipeIdList.push(rcp.recipeId);
                }

            }

        };
    }
    try {
        await saveRecipe(productList);
    } catch (error) {
        return res.send(errResponse(baseResponse.RECIPE_ERROR));
    }
    

    let cnt = 0;
    async function processArray2(recipeIdList) {
        for (const recipeId of recipeIdList) {  

            const connection = await pool.getConnection(async (conn) => conn);
            const recipeResult = await rcpDao.selectRecipe(connection, userId, recipeId, page, size);
            totalData[cnt] = recipeResult[0];
            cnt += 1;
            connection.release();                     
        
        }   
    }

    await processArray2(recipeIdList);

    return res.send(response({ isSuccess:true, code:1000, message:" 레시피 조회 완료!" }, totalData ));
};


/**
 * API No. 61. 
 * API Name : 레시피 상세 조회 API
 * [POST] /user/recipe/:recipeId
 * 
 */

 exports.likeRecipe = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const recipeId = req.params.recipeId;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    

    // 공백 체크
    var re = /^ss*$/;

    if(!recipeId || re.test(recipeId))
        return res.send(errResponse(baseResponse.INPUT_RECIPEID ));

    if (!Number(recipeId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    // recipeId 
    const existRecipe = await rcpProvider.selectRecipeID(userId, recipeId);
    if(existRecipe.length < 1)
        return res.send(errResponse(baseResponse.INVALID_RECIPEID));


    var scrab = await rcpProvider.selectScrab(userId, recipeId);
    if(scrab[0].exist == 0){
        const addScrab = await rcpService.addScrab(userId, recipeId);
        return res.send({ isSuccess:true, code:1000, message:"좋아요 설정 성공!", "result": { "recipeId" : Number(recipeId) }});
        
    } else {
        var [check] = await rcpProvider.selectScrabStatus(userId, recipeId);
        
        if(check.status == 1) {
            const updateDelete = await rcpService.deleteScrab(userId, recipeId);
            return res.send({ isSuccess:true, code:1000, message:"좋아요 해제 성공!", "result": { "recipeId" : Number(recipeId) }});
        
        } else {
            const updateAdd = await rcpService.updateScrab(userId, recipeId);
            return res.send({ isSuccess:true, code:1000, message:"좋아요 설정 성공!",  "result": { "recipeId" : Number(recipeId) }});
        }
    }

};


/**
 * API No. 61
 * API Name : 레시피 상세 조회 API
 * [GET] /user/recipe/detail/:recipeId
 * 
 */

 exports.detailRecipe = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const recipeId = req.params.recipeId;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    

    // 공백 체크
    var re = /^ss*$/;

    if(!recipeId || re.test(recipeId))
        return res.send(errResponse(baseResponse.INPUT_RECIPEID ));

    if (!Number(recipeId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    // recipeId 
    const existRecipe = await rcpProvider.selectRecipeID(userId, recipeId);
    if(existRecipe.length < 1)
        return res.send(errResponse(baseResponse.INVALID_RECIPEID));

    // var manual = [];

    const recipeInfo = await rcpProvider.retrieveRecipeInfo(userId, recipeId);
    if(recipeInfo.length < 1)
        return res.send(errResponse(baseResponse.NO_SEARCH_RECIPE));


    // const manual1 = await rcpProvider.retrieveRecipeManual1(userId, recipeId);
    // if(manual1.length > 0){
    //     //Object.assign( manual , {"manual1" : JSON.parse(JSON.stringify(manual1[0]))});
    //     manual.push(manual1[0]);
    // }
    // const manual2 = await rcpProvider.retrieveRecipeManual2(userId, recipeId);
    // if(manual2.length > 0){
    //     // Object.assign( manual , {"manual2" : JSON.parse(JSON.stringify(manual2[0]))});
    //     manual.push(manual2[0]);
    // }
    // const manual3 = await rcpProvider.retrieveRecipeManual3(userId, recipeId);
    // if(manual3.length > 0){
    //     // Object.assign( manual , {"manual3" : JSON.parse(JSON.stringify(manual3[0]))});
    //     manual.push(manual3[0]);
    // }
    // const manual4 = await rcpProvider.retrieveRecipeManual4(userId, recipeId);
    // if(manual4.length > 0){
    //     // Object.assign( manual , {"manual4" : JSON.parse(JSON.stringify(manual4[0]))});
    //     manual.push(manual4[0]);
    // }
    // const manual5 = await rcpProvider.retrieveRecipeManual5(userId, recipeId);
    // if(manual5.length > 0){
    //     // Object.assign( manual , {"manual5" : JSON.parse(JSON.stringify(manual5[0]))});
    //     manual.push(manual5[0]);
    // }
    // const manual6 = await rcpProvider.retrieveRecipeManual6(userId, recipeId);
    // if(manual6.length > 0){
    //     //Object.assign( manual , {"manual6" : JSON.parse(JSON.stringify(manual6[0]))});
    //     manual.push(manual6[0]);
    // }
    // const manual7 = await rcpProvider.retrieveRecipeManual7(userId, recipeId);
    // if(manual7.length > 0){
    //     // Object.assign( manual , {"manual7" : JSON.parse(JSON.stringify(manual7[0]))});
    //     manual.push(manual7[0]);
    // }
    // const manual8 = await rcpProvider.retrieveRecipeManual8(userId, recipeId);
    // if(manual8.length > 0){
    //     // Object.assign( manual , {"manual8" : JSON.parse(JSON.stringify(manual8[0]))});
    //     manual.push(manual8[0]);
    // }

    // const manual9 = await rcpProvider.retrieveRecipeManual9(userId, recipeId);
    // if(manual9.length > 0){
    //     // Object.assign( manual , {"manual9" : JSON.parse(JSON.stringify(manual9[0]))});
    //     manual.push(manual9[0]);
    // }
    // const manual10 = await rcpProvider.retrieveRecipeManual10(userId, recipeId);
    // if(manual10.length > 0){
    //     // Object.assign( manual , {"manual10" : JSON.parse(JSON.stringify(manual10[0]))});
    //     manual.push(manual10[0]);
    // }
    // const manual11 = await rcpProvider.retrieveRecipeManual11(userId, recipeId);
    // if(manual11.length > 0){
    //     // Object.assign( manual , {"manual11" : JSON.parse(JSON.stringify(manual11[0]))});
    //     manual.push(manual11[0]);
    // }
    // const manual12 = await rcpProvider.retrieveRecipeManual12(userId, recipeId);
    // if(manual12.length > 0){
    //     // Object.assign( manual , {"manual12" : JSON.parse(JSON.stringify(manual12[0]))});
    //     manual.push(manual12[0]);
    // }
    // const manual13 = await rcpProvider.retrieveRecipeManual13(userId, recipeId);
    // if(manual13.length > 0){
    //     // Object.assign( manual , {"manual13" : JSON.parse(JSON.stringify(manual13[0]))});
    //     manual.push(manual13[0]);
    // }
    // const manual14 = await rcpProvider.retrieveRecipeManual14(userId, recipeId);
    // // totalData[totalData.length - 1] = manual14;
    // if(manual14.length > 0){
    //    //  Object.assign( manual , {"manual14" : JSON.parse(JSON.stringify(manual14[0]))});
    //    manual.push(manual14[0]);
    // }
    // const manual15 = await rcpProvider.retrieveRecipeManual15(userId, recipeId);
    // if(manual15.length > 0){
    //     // Object.assign( manual , {"manual15" : JSON.parse(JSON.stringify(manual15[0]))});
    //     manual.push(manual15[0]);
    // }


    return res.send({ isSuccess:true, code:1000, message:"레시피 상세 조회 완료!", "result": recipeInfo });

};



/**
 * API No. 57
 * API Name : 유저의 친구 정보 조회 API
 * [GET] /user/friend-info
 * 
 */

 exports.getUserFriend = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    // 유저 체크
    const statusCheck1 = await userProvider.checkUserStatus(userId);
    if(statusCheck1.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    
    const friendList = await pushProvider.retrieveFriendList(userId);
    if(friendList.length < 1)
        return res.send(errResponse(baseResponse.NO_EXIST_FRIEND));


    return res.send({ isSuccess:true, code:1000, message:"유저의 친구 정보 조회 완료!", "result": friendList });

};


/**
 * API No. 59
 * API Name : 레시피 검색 API
 * [GET] /user/recipe/search?product = 
 * 
 */

 exports.searchRecipe = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    let { product, page } = req.query;
    const size = 120;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    if(!page)
      return res.send(response(baseResponse.NO_EMPTY_PAGE));

    if(page == 0)
        return res.send(response(baseResponse.INPUT_PAGE_RANGE));

    page = size * (page-1);


    const recipeInfo = await rcpProvider.retrieveRecipeProduct(userId, product, page, size);
    if(recipeInfo.length < 1)
        return res.send(errResponse(baseResponse.NO_SEARCH_RECIPE));

    return res.send({ isSuccess:true, code:1000, message:"레시피 검색 조회 완료!", "result": recipeInfo });

};



/**
 * API No. 30
 * API Name : 찜 - 레시피 조회 API
 * [GET] /jjim/recipe
 * 
 */

 exports.getJjimRecipe = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    let { page } = req.query;
    const size = 120;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    if(!page)
      return res.send(response(baseResponse.NO_EMPTY_PAGE));

    if(page == 0)
        return res.send(response(baseResponse.INPUT_PAGE_RANGE));

    page = size * (page-1);


    const recipeInfo = await rcpProvider.retrieveJjimRecipe(userId, page, size);
    if(recipeInfo.length < 1)
        return res.send(errResponse(baseResponse.NO_SEARCH_RECIPE));

    return res.send({ isSuccess:true, code:1000, message:"레시피 찜 조회 완료!", "result": recipeInfo });

};