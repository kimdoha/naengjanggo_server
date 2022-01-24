//const request = require('request');
const { pool } = require("../../../config/database");

const jwtMiddleware = require("../../../config/jwtMiddleware");
const shopProvider = require("../../app/ShoppingList/shoppingProvider");
const shopService = require("../../app/ShoppingList/shoppingService");
const shopDao = require("./shoppingDao");
const userProvider = require("../User/userProvider");

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const { connect } = require("http2");

const regexEmail = require("regex-email");
const {emit, addListener} = require("nodemon");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");



/**
 * API No. 14. 
 * API Name : 식재료 추가 API
 * [POST] /shoppinglist/product
 * 
 */

exports.insertList = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { product } = req.body;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
  
    // 빈 값 체크
    if(!product)
        return res.send(errResponse(baseResponse.INPUT_PRODUCT));

    // 공백 체크
    var re = /^ss*$/;
    if(re.test(product))
        return res.send(errResponse(baseResponse.INPUT_PRODUCT));

    if (!String(product))
        return res.send(errResponse(baseResponse.INPUT_STRING));

    // 길이 체크
    if (product.length > 100){
        return res.send(errResponse(baseResponse.EXCEED_LENGTH));
    }

    const listResponse = await shopService.insertList(userId, product);

    return res.send({ isSuccess:true, code:1000, message:"장보기리스트 추가 완료!", "result": { product: product }});
};


/**
 * API No. 15. 
 * API Name : 식재료 삭제 API
 * [POST] /shoppinglist/product-delete/:listId
 * 
 */

 exports.deleteList = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const listId = req.params.listId;

    var re = /^ss*$/; // 공백 체크
    var regExp = /^[0-9]+$/; // 숫자 체크

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
  
    if(!listId || re.test(listId) || !regExp.test(listId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    // 해당 리스트 유효성 검사
    const listExist = await shopProvider.existList(userId, listId);
    //console.log(listExist);
    if(listExist.exist === 1){
        var productInfo = await shopProvider.selectProductByListId(userId, listId);
        var product = productInfo.content;
        const listResponse = await shopService.deleteList(userId, listId);
        return res.send({ isSuccess:true, code:1000, message:"장보기리스트 삭제 완료!", "result": { "listId" : listId , "product" : product}});
    } else {
        return res.send(errResponse(baseResponse.SHOPPINGLIST_NOT_DELETE ));
    }

};


/**
 * API No. 16. 
 * API Name : 장보기 리스트 조회 API (+날짜별)
 * [POST] /shoppinglist
 * 
 */

 exports.selectList = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
  
    var dateInfo = await shopProvider.selectLatestDate(userId);
    console.log(dateInfo);
    let count = 0;
    let totalData = [];
    let num = dateInfo.length;
    while(count < num){
        var date = dateInfo[count].date;
        var listInfo = await shopProvider.selectProductByToday(userId, date);
        var result = {"Date" : date , listInfo};
        //console.log(result);
        totalData[count] = result;
        count += 1;
    }
    return res.send({ isSuccess:true, code:1000, message:"가장 최신의 장보기리스트 조회 완료!", "result": totalData });

};


/**
 * API No. 17. 
 * API Name : 날짜별 토글 펼치기 및 접기 API (+날짜별)
 * [GET] /shoppinglist/month
 * 
 */

 exports.listByMonth = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
  
    var dateInfo = await shopProvider.selectDateByMonth(userId);
    
    let count = 0;
    let totalData = [];
    let num = dateInfo.length;
    if(num === 0)
        return res.send(errResponse(baseResponse.INPUT_LAST_DATE));

    while(count < num){
        var date = dateInfo[count].date;
        var listInfo = await shopProvider.selectProductByMonth(userId, date);
        var result = {"Date" : date , listInfo};
        //console.log(result);
        totalData[count] = result;
        count += 1;
    }

    return res.send({ isSuccess:true, code:1000, message:"날짜별 장보기리스트 조회 완료!", "result" : totalData});

};



/**
 * API No. 18. 
 * API Name : 식재료 메시지 API 
 * [GET] /shoppinglist/product-message
 * 
 */
 exports.searchProduct = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { search } = req.query;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    var re = /^ss*$/; // 공백 체크

    if(!search || re.test(search))
        return res.send(errResponse(baseResponse.INPUT_LIST_SEARCH));
    
    if(!String(search))
        return res.send(errResponse(baseResponse.INPUT_STRING));

    if(search.length < 1)
        return res.send(errResponse(baseResponse.INPUT_LIST_SEARCH))

  
    var count = await shopProvider.retrieveProductCount(userId, search);
    //console.log(count);
    if(count.length > 0){
        if(count[0].productCount > 0){
            var message = await shopProvider.retrieveProductMessage(userId, search);
            return res.send({ isSuccess:true, code:1000, message:"장보기리스트 메시지 조회 완료!", "result" : message[0] });
        } else {
            return res.send(errResponse(baseResponse.NO_EXIST_MESSAGE));
        }
    } else {
        return res.send(errResponse(baseResponse.NO_EXIST_MESSAGE));
    }

};