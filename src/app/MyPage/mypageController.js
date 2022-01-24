//const request = require('request');
const { pool } = require("../../../config/database");
const {logger} = require("../../../config/winston");

const jwtMiddleware = require("../../../config/jwtMiddleware");
const mypgProvider = require("./mypageProvider");
const mypgService = require("./mypageService");
const mypgDao = require("./mypageDao");
const userProvider = require("../User/userProvider");
const mainProvider = require("../Main/mainProvider");

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const { connect } = require("http2");

const regexEmail = require("regex-email");
const {emit, addListener} = require("nodemon");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");


/**
 * API No. 55. 
 * API Name : 내가 쓴 글 조회 API ( + 필터 )
 * [GET] /com/my-view/category/:category
 * 
 */

 exports.selectMyPost = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const category = req.params.category;
    const size = 120;
    let { type, page } = req.query;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));


    // 공백 체크
    var re = /^ss*$/;

    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));

    if (!Number(category))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    //default 설정
    if(!type) type = '최신순';

    let filterArr = ['최신순','조회순','과거순','좋아요순'];
    if(filterArr.includes(type) != true){
        return res.send(response(baseResponse.INPUT_FILTER_WRONG));
    }

    if(!page)
        return res.send(response(baseResponse.NO_EMPTY_PAGE));

    if(page == 0)
        return res.send(response(baseResponse.INPUT_PAGE_RANGE));

    page = size * (page-1);


    // 필터별 커뮤니티
    const communityInfo = await mypgProvider.selectMyPost(userId, category, type, page, size);
    if(communityInfo.length < 1){
        return res.send(response(baseResponse.SEARCH_RESULT_EMPTY));
    }

    if(category == 1)
        return res.send({ isSuccess:true, code:1000, message:"[식재료 관리법] 내가 쓴 글 조회 완료!", "result": { communityInfo }});
    else 
        return res.send({ isSuccess:true, code:1000, message:"[꿀팁공유] 내가 쓴 글 조회 완료!", "result": { communityInfo }});

};


/**
 * API No. 56. 
 * API Name : 유통기한 알림 설정 API
 * [PATCH] /users/setpush/date/:day
 * 
 */

 exports.setPushDate = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    let day = req.params.day;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));


    const existAlarm = await mypgProvider.existAlarm(userId);
    if(existAlarm.length > 0){
        var re = /^ss*$/;
        console.log(day);

        if(!day || re.test(day))
            return res.send(errResponse(baseResponse.INPUT_EXPIRY_DATE));
    

        if(day != 0){
            // day가 있어 그러면 day 수정
    
            if(!Number(day))
            return res.send(errResponse(baseResponse.INPUT_NUMBER));

            // 1 2 3 4 5 6 7
            if( 1 > day || day > 7)
                return res.send(errResponse(baseResponse.INVALID_EXPIRY_DATE));
        
            const dateAlarm = existAlarm[0].dateAlarm;
            if(dateAlarm == 1){
                const updateResult = await mypgService.updateDate(userId, day);
                if(updateResult == baseResponse.DB_ERROR)
                    return res.send(errResponse(baseResponse.DB_ERROR));
                return res.send({ isSuccess:true, code:1000, message:"유통기한 알림 수정 완료!"});
            } else {
                return res.send(errResponse(baseResponse.DATE_ALARM_OFF));
            }
            
        } else {
            // day가 없다 => 공유하고 공유안하고만
            const dateAlarm = existAlarm[0].dateAlarm;
            if(dateAlarm == 1){
                // 1이므로 0으로
                const updateResultOff = await mypgService.updateDateOff(userId);
                if(updateResultOff == baseResponse.DB_ERROR)
                    return res.send(errResponse(baseResponse.DB_ERROR));
                return res.send({ isSuccess:true, code:1000, message:"유통기한 알림 OFF 완료!"});
                    
            } else {
                // 0이므로 1로
                day = 7;
                const updateResultOn = await mypgService.updateDateOn(userId, day);
                if(updateResultOn == baseResponse.DB_ERROR)
                    return res.send(errResponse(baseResponse.DB_ERROR));
                return res.send({ isSuccess:true, code:1000, message:"유통기한 알림 ON 완료!"});
            }
        }



    } else {
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT))
    }

};



/**
 * API No. 53.
 * API Name : 댓글 알림 설정 API
 * [PATCH] /users/setpush/comment
 * 
 */

 exports.setPushComment = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));


    const existAlarm = await mypgProvider.existAlarm(userId);
    if(existAlarm.length > 0){
        const commentAlarm = existAlarm[0].commentAlarm;
        if(commentAlarm == 1){
            // 1이므로 0으로
            const updateResultOff = await mypgService.updateCommentOff(userId);
            if(updateResultOff == baseResponse.DB_ERROR)
                return res.send(errResponse(baseResponse.DB_ERROR));
            return res.send({ isSuccess:true, code:1000, message:"댓글 알림 설정 OFF 완료!" });
                
        } else {
            // 0이므로 1로
            const updateResultOn = await mypgService.updateCommentOn(userId);
            if(updateResultOn == baseResponse.DB_ERROR)
                return res.send(errResponse(baseResponse.DB_ERROR));
            return res.send({ isSuccess:true, code:1000, message:"댓글 알림 설정 ON 완료!" });
        }
    } else {
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT))
    }

};


/**
 * API No. 60.
 * API Name : 댓글 및 유통기한 설정 조회 API
 * [GET] /users/setpush
 * 
 */

 exports.selectMyAlarm = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));


    const existAlarm = await mypgProvider.existAlarm(userId);
    if(existAlarm.length > 0){
        const alarmInfo = await mypgProvider.selectMyAlarm(userId);
        return res.send({ isSuccess:true, code:1000, message:"댓글 및 유통기한 알림 조회 완료!" , "result" : alarmInfo });
    } else {
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT))
    }

};

/**
 * API No. 8.
 * API Name : 냉장고 타입 수정 API
 * [PATCH] /users/fridge/:count/type/:type
 * 
 */

 exports.setFridgeType= async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { count, type } = req.params;

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


    // type 체크
    if(!type || !Number(type))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    // 공백 체크
    var re = /^ss*$/;
    if(re.test(type))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(type < 1 || type > 6)
        return res.send(errResponse(baseResponse.EXCEED_NUMBER));


    // 존재하는 카운트인지 확인
    const fridgeList = await userProvider.existFridgeCount(userId, count);
    if(fridgeList[0].exist === 1){
        
        const fridge = await mainProvider.retrieveFridgeCount(userId, count);
        const fridgeId = fridge.frigeId;

        if(type == fridge.fridgeType)
            return res.send(errResponse(baseResponse.FRIDGE_CHANGE));

        const changeFridge = await mypgService.changeFridge(userId, fridgeId, count, type);
        if(changeFridge == baseResponse.DB_ERROR)
            return res.sendd(errResponse(baseResponse.DB_ERROR));
        
    } else {
        return res.send(errResponse(baseResponse.NO_EXIST_FRIDGE));
    }

    return res.send({ isSuccess:true, code:1000, message:"냉장고 타입 수정 완료!" });

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