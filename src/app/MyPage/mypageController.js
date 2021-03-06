//const request = require('request');
const { pool } = require("../../../config/database");
const {logger} = require("../../../config/winston");

const validation = require("../../../config/validation");
const mypgProvider = require("./mypageProvider");
const mypgService = require("./mypageService");
const mypgDao = require("./mypageDao");
const userProvider = require("../User/userProvider");
const mainProvider = require("../Main/mainProvider");

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse, resFormat} = require("../../../config/response");


/**
 * update : 2022.01.28
 * API No. 55. 
 * API Name : 내가 쓴 글 조회 API ( + 필터 )
 * [GET] /com/my-view/category/:category
 * 
 */

 exports.getMyPostLists = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const category = req.params.category;
    let { type, page } = req.query;

    if(!category)
        return res.send(resFormat(false, 201, "카테고리가 정의 되지 않았습니다."));
    
    if(!type) type = '최신순';

    if(!page)
        return res.send(resFormat(false, 202, "페이지가 정의 되지 않았습니다."));
    
        if(page == 0) page = 1;

    let filterArray = ['최신순','조회순','과거순','좋아요순'];
    if (!validation.isNumberCheck(category) || !validation.isNumberCheck(page) || !filterArray.includes(type))
        return res.send(resFormat(false, 203, "입력 형식이 올바르지 않습니다."));

    if(1 > category || category > 2)
        return res.send(resFormat(false, 204, "입력 가능한 카테고리 범위를 벗어났습니다."))


    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            if(!(await validation.isValidUser(userId))){
                connection.release();
                return res.send(resFormat(false, 301, "존재하지 않는 유저입니다."));
            }
            if(await validation.isDeclaredUser(userId)){
                connection.release();
                return res.send(resFormat(false, 302, "신고당한 블랙 유저입니다."));
            }

            let getMyPostLists = [];
            let getMyPostListsQuery = `SELECT postId, title, mainImg,
                                        CAST(IFNULL((SELECT status FROM Jjim WHERE userId = ${userId} AND postId = P.postId), 0) as unsigned) AS scrab,
                                        (SELECT count(*) FROM Jjim WHERE postId = P.postId AND status = 'Y') AS likeCount,
                                        (SELECT count(*) FROM Comment WHERE status = 'Y' AND postId = P.postId) AS comments
                                    FROM Post P
                                    WHERE category = ${category} AND P.status = 'Y'
                                    AND P.userId = ${userId} `;

            let filterQuery = ``;
            let pageQuery = ` LIMIT 10 OFFSET ?;`;

            // 필터별 커뮤니티
            if(type == '최신순'){     

                filterQuery = `ORDER BY P.createAt DESC`;

            } else if(type == '조회순'){

                filterQuery = `ORDER BY (SELECT count(*) FROM Watched W WHERE W.postId = P.postId) DESC`;

            } else if(type == '과거순'){

                filterQuery = `ORDER BY P.createAt`;

            } else if(type == '좋아요순'){

                filterQuery = `ORDER BY scrab DESC`;

            }

            getMyPostListsQuery = getMyPostListsQuery + filterQuery + pageQuery;
                
            [getMyPostLists] = await connection.query(getMyPostListsQuery , (parseInt(page) - 1) * 10);

            
            let responseData;
            if(category === 1){
                responseData = resFormat(true, 100, "[식재료 관리법] 내가 쓴 글 조회 완료!");
            } else { 
                responseData = resFormat(true, 100, "[꿀팁 공유] 내가 쓴 글 조회 완료!");
            }
          responseData.result = getMyPostLists;
          connection.release();
          return res.json(responseData);
        } catch (err) {
          // await connection.rollback(); // ROLLBACK
          connection.release();
          logger.error(`App - Get My Post Lists Query error\n: ${err.message}`);
          return res.json(resFormat(false, 500, "Get My Post Lists Query error"));
        }
      } catch (err) {
        logger.error(`App - Get My Post Lists Connection error\n: ${err.message}`);
        return res.json(resFormat(false, 501, "Get My Post Lists Connection error"));
      }

};


/**
 * update : 2022.01.31
 * API No. 56. 
 * API Name : 유통기한 알림 설정 API
 * [PATCH] /users/shelf-life/alarm-diff/:day
 * 
 */

 exports.setAlarmDiffByShelfLife = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    let day = req.params.day;
    let responseData;

    if(!day) day = 7;

    if(1 > day || 7 < day)
        return res.send(resFormat(false, 201, "만료일은 1 ~ 7 사이 입니다."))
    
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            if(!(await validation.isValidUser(userId))){
                connection.release();
                return res.send(resFormat(false, 301, "존재하지 않는 유저입니다."));
              }
        
              if(await validation.isDeclaredUser(userId)){
                connection.release();
                return res.send(resFormat(false, 302, "신고당한 블랙 유저입니다."));
              }

            const isSetShelfLifeAlarmQuery = `SELECT * 
                                              FROM Alarm
                                              WHERE status = 'Y' AND userId = ?;`;
            const [isSetShelfLifeAlarm] = await connection.query(isSetShelfLifeAlarmQuery, userId);
            
            if(isSetShelfLifeAlarm.length < 1){
     
                const createUserShelfLifeAlarmQuery = `INSERT INTO Alarm(userId, dateDiff) VALUES(?, ?)`;
                await connection.query(createUserShelfLifeAlarmQuery, [ userId, day ]);
                responseData = resFormat(true, 100, "유통기한 알림 설정 완료!" );

            } else {
                const alarm = isSetShelfLifeAlarm[0].shelfLifeAlarm;

                if(alarm == 'Y'){
                    const patchUserShelfLifeAlarmOffQuery = `UPDATE Alarm 
                                                            SET shelfLifeAlarm = 'N'
                                                            WHERE shelfLifeAlarm = 'Y' AND userId = ?;`;

                    await connection.query(patchUserShelfLifeAlarmOffQuery, userId );
                    responseData = resFormat(true, 100, "유통기한 알림 OFF 완료!" );

                } else {
                    const patchUserShelfLifeAlarmOnQuery = `UPDATE Alarm 
                                                            SET shelfLifeAlarm = 'Y', dateDiff = ?
                                                            WHERE shelfLifeAlarm = 'N' AND userId = ?;`;

                    await connection.query(patchUserShelfLifeAlarmOnQuery, [ day, userId ]);
                    responseData = resFormat(true, 100, "유통기한 알림 ON 완료!" );
                } 
            }

            
          connection.release();
          return res.json(responseData);
        } catch (err) {
          // await connection.rollback(); // ROLLBACK
          connection.release();
          logger.error(`App - Set Alarm Diff By Shelf Life Query error\n: ${err.message}`);
          return res.json(resFormat(false, 500, "Set Alarm Diff By Shelf Life Query error"));
        }
      } catch (err) {
        logger.error(`App - Set Alarm Diff By Shelf Life DB Connection error\n: ${err.message}`);
        return res.json(resFormat(false, 501, "Set Alarm Diff By Shelf Life DB Connection error"));
      }
};



/**
 * update : 2022.01.31
 * API No. 53.
 * API Name : 댓글 알림 설정 API
 * [PATCH] /users/comment/alarm
 * 
 */

 exports.setCommentAlarm = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    let responseData;
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            if(!(await validation.isValidUser(userId))){
                connection.release();
                return res.send(resFormat(false, 301, "존재하지 않는 유저입니다."));
            }
        
              if(await validation.isDeclaredUser(userId)){
                connection.release();
                return res.send(resFormat(false, 302, "신고당한 블랙 유저입니다."));
            }

            const isSetCommentAlarmQuery = `SELECT *
                                            FROM Alarm
                                            WHERE status = 'Y' AND userId = ?;`;
            const [isSetCommentAlarm] = await connection.query(isSetCommentAlarmQuery, userId);
            if(isSetCommentAlarm.length > 0){
                const commentAlarm = isSetCommentAlarm[0].commentAlarm;
                if(commentAlarm == 'Y'){
                    const patchUserCommentAlarmOffQuery = `UPDATE Alarm
                                                        SET commentAlarm = 'N'
                                                        WHERE commentAlarm = 'Y' AND userId = ?;`;
                    await connection.query( patchUserCommentAlarmOffQuery, userId );
                    responseData = resFormat(true, 100, "댓글 알림 설정 OFF 완료!");
                        
                } else {
                    const patchUserCommentAlarmOnQuery = `UPDATE Alarm
                                                        SET commentAlarm = 'Y'
                                                        WHERE commentAlarm = 'N' AND userId = ?;`;
                    await connection.query(patchUserCommentAlarmOnQuery, userId);
                    responseData = resFormat(true, 100, "댓글 알림 설정 ON 완료!");
                }
  
            } else {
                const createUserCommentAlarmQuery = `INSERT INTO Alarm(userId) VALUES(?)`;
                await connection.query(createUserCommentAlarmQuery, userId);
                responseData = resFormat(true, 100, "댓글 알림 설정 완료!" );
            }
          connection.release();
          return res.json(responseData);
        } catch (err) {
          // await connection.rollback(); // ROLLBACK
          connection.release();
          logger.error(`App - set Comment Alarm Query error\n: ${err.message}`);
          return res.json(resFormat(false, 500, "set Comment Alarm Query error"));
        }
      } catch (err) {
        logger.error(`App - set Comment Alarm DB Connection error\n: ${err.message}`);
        return res.json(resFormat(false, 501, "set Comment Alarm DB Connection error"));
      }
};


/**
 * update : 2022.01.31
 * API No. 60.
 * API Name : 댓글 및 유통기한 설정 조회 API
 * [GET] /users/alarm-info
 * 
 */

 exports.getUserAlarmInfo = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            if(!(await validation.isValidUser(userId))){
                connection.release();
                return res.send(resFormat(false, 301, "존재하지 않는 유저입니다."));
            }
        
              if(await validation.isDeclaredUser(userId)){
                connection.release();
                return res.send(resFormat(false, 302, "신고당한 블랙 유저입니다."));
            }
            
            const getUserAlarmInfoQuery = `SELECT commentAlarm, shelfLifeAlarm , dateDiff as shelfLifeDateDiff
                                            FROM Alarm
                                            WHERE status = 'Y' AND userId = ?;`;
            const [alarmInfo] = await connection.query(getUserAlarmInfoQuery , userId);


          let responseData = resFormat(true, 100, "댓글 및 유통기한 알림 조회 완료!");
          responseData.result = alarmInfo;
          connection.release();
          return res.json(responseData);
        } catch (err) {
          // await connection.rollback(); // ROLLBACK
          connection.release();
          logger.error(`App - get User Alarm Info Query error\n: ${err.message}`);
          return res.json(resFormat(false, 500, "get User Alarm Info Query error"));
        }
      } catch (err) {
        logger.error(`App - get User Alarm Info DB Connection error\n: ${err.message}`);
        return res.json(resFormat(false, 501, "get User Alarm Info DB Connection error"));
      }
};

/**
 * update : 2022.01.31
 * API No. 8.
 * API Name : 냉장고 타입 수정 API
 * [PATCH] /users/fridge/:fridgeId/type/:type
 * 
 */

 exports.setUserFridgeType = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { fridgeId, type } = req.params;


    if(!fridgeId)
        return res.send(resFormat(false, 201, "fridgeId가 정의 되지 않았습니다."))

    if(!type)
        return res.send(resFormat(false, 202, "타입이 정의 되지 않았습니다."));

    if(1 > type || 6 < type )
        return res.send(resFormat(false, 203, "타입 입력 범위가 올바르지 않습니다."))

    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            if(!(await validation.isValidUser(userId))){
                connection.release();
                return res.send(resFormat(false, 301, "존재하지 않는 유저입니다."));
            }
        
            if(await validation.isDeclaredUser(userId)){
                connection.release();
                return res.send(resFormat(false, 302, "신고당한 블랙 유저입니다."));
            }

            const paramsForGettingFridgeInfo = [ fridgeId, userId ];
            const paramsForUpdatingFridgeInfo = [ type, fridgeId, userId ];

            // 존재하는 카운트인지 확인
            await connection.beginTransaction();
            const isExistUserFridgeQuery = `SELECT EXISTS(SELECT *
                                            FROM Fridge
                                            WHERE fridgeId = ? AND userId = ? AND status = 'Y') AS exist;`;
            const [isExistUserFridge] = await connection.query(isExistUserFridgeQuery, paramsForGettingFridgeInfo);

            if(isExistUserFridge[0].exist){
                const deleteFoodStocksInFridgeQuery = `UPDATE FoodStock SET status = 'N' WHERE fridgeId = ? AND userId = ?;`;
                await connection.query(deleteFoodStocksInFridgeQuery, paramsForGettingFridgeInfo);
              
                const patchUserFridgeTypeQuery = `UPDATE Fridge SET fridgeType = ? WHERE fridgeId = ? AND userId = ? AND status = 'Y';`;
                await connection.query(patchUserFridgeTypeQuery, paramsForUpdatingFridgeInfo);

            } else {
                await connection.commit();
                connection.release();
                return res.send(resFormat(false, 303, "해당 냉장고가 존재하지 않습니다."));
            }
         
            let responseData = resFormat(true, 100, "냉장고 타입 수정 완료!");
            await connection.commit();
            connection.release();
            return res.json(responseData);
        } catch (err) {
          await connection.rollback(); // ROLLBACK
          connection.release();
          logger.error(`App - set User Fridge Type Query error\n: ${err.message}`);
          return res.json(resFormat(false, 500, "set User Fridge Type Query error"));
        }
      } catch (err) {
        logger.error(`App - set User Fridge Type DB Connection error\n: ${err.message}`);
        return res.json(resFormat(false, 501, "set User Fridge Type DB Connection error"));
      }
};



/**
 * API No. 8.
 * API Name : 냉장고 타입 삭제 API
 * [PATCH] /users/fridge/:count
 * 
 */

 exports.deleteFridge = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { count } = req.params;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    
    // count 체크
    if(!count || !Number(count))
        return res.send(errResponse(baseResponse.COUNT_INPUT_NUMBER));

    // 공백 체크
    var re = /^ss*$/;
    if(re.test(count))
        return res.send(errResponse(baseResponse.COUNT_INPUT_NUMBER));

    if(count > 4)
        return res.send(errResponse(baseResponse.COUNT_EXCEED_NUMBER));


    // 존재하는 카운트인지 확인
    const fridgeList = await userProvider.existFridgeCount(userId, count);
    if(fridgeList[0].exist === 1){
        
        const totalFridgeCount = await mypgProvider.totalFridgeCount(userId);
        if(totalFridgeCount.count == 1)
            return res.send(errResponse(baseResponse.NO_DELETE_FRIDGE));

        const fridge = await mainProvider.retrieveFridgeCount(userId, count);
        const fridgeId = fridge.frigeId;

        const deleteFridge = await mypgService.deleteFridge(userId, fridgeId, count);
        if(deleteFridge == baseResponse.DB_ERROR)
           return res.sendd(errResponse(baseResponse.DB_ERROR));
        
    } else {
        return res.send(errResponse(baseResponse.NO_EXIST_FRIDGE));
    }

    return res.send({ isSuccess:true, code:1000, message: `${count}번째 냉장고 삭제 완료!` });

};



/**
 * API No. 6.
 * API Name : 회원 탈퇴 API
 * [PATCH] /user/signout
 * 
 */

 exports.signOut = async function (req, res) {
    try {
        try {
            const userId = req.verifiedToken.userId; // 내 아이디

            // 유저 체크
            const statusCheck = await userProvider.checkUserStatus(userId);
            if(statusCheck.length < 1)
                return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

            const connection = await pool.getConnection(async (conn) => conn);
            await connection.beginTransaction();

            // Alarm
            const deleteAlarm = await mypgDao.deleteAlarm(connection, userId);

            // Comment
            const deleteComment = await mypgDao.deleteComment(connection, userId);
            
            // Comments
            const deleteComments = await mypgDao.deleteComments(connection, userId);

            // FoodWaste
            const deleteFoodWaste = await mypgDao.deleteFoodWaste(connection, userId);

            // Fridge
            const deleteFridge = await mypgDao.deleteFridgeByUserId(connection, userId);

            // Friend 
            const deleteFriend = await mypgDao.deleteFriend(connection, userId);

            // JJim
            const deleteJjim = await mypgDao.deleteJjim(connection, userId);

            // Like1
            const deleteLike1 = await mypgDao.deleteLike1(connection, userId);

            // Like2
            const deleteLike2 = await mypgDao.deleteLike2(connection, userId);

            // MySearch
            const deleteMySearch = await mypgDao.deleteMySearch(connection, userId);

            // Notice
            const deleteNotice = await mypgDao.deleteNotice(connection, userId);

            // Post
            const deletePost = await mypgDao.deletePost(connection, userId);

            // PostContent
            const deletePostContent = await mypgDao.deletePostContent(connection, userId);

            // Product
            const deleteProduct = await mypgDao.deleteProduct(connection, userId);

            // Receipt
            const deleteReceipt = await mypgDao.deleteReceipt(connection, userId);

            // Recipe
            const deleteRecipe = await mypgDao.deleteRecipe(connection, userId);

            // Scrab
            const deleteScrab = await mypgDao.deleteScrab(connection, userId);

            // ShoppingList
            const deleteShopping = await mypgDao.deleteShopping(connection, userId);
            
            // User
            const deleteUser = await mypgDao.deleteUser(connection, userId);

            // Watched
            const deleteWatch = await mypgDao.deleteWatch(connection, userId);

            await connection.commit();
            connection.release();
            return res.send({ isSuccess:true, code:1000, message: `${userId}번 유저 회원탈퇴 완료!` });
            
        } catch (err) {
            const connection = await pool.getConnection(async (conn) => conn);
            await connection.rollback();
            connection.release();

            logger.error(`App - TOTAL DB Connection error\n: ${JSON.stringify(err)}`);
            return res.json(errResponse(baseResponse.DB_ERROR));
        }
    } catch (err) {
        logger.error(`App - TOTAL DB error\n: ${JSON.stringify(err)}`);
        return res.json(errResponse(baseResponse.SERVER_ERROR));
    }


};