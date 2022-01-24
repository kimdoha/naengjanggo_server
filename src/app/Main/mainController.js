const request = require('request');
const { pool } = require("../../../config/database");

const jwtMiddleware = require("../../../config/jwtMiddleware");
const mainProvider = require("./mainProvider");
const mainService = require("./mainService");
const mainDao = require("./mainDao");
const userProvider = require("../User/userProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse, resFormat} = require("../../../config/response");
const { connect } = require("http2");

const regexEmail = require("regex-email");
const {emit, addListener} = require("nodemon");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");

require('dotenv').config()


/**
 * API No. 19. 
 * API Name : 영수증 인식 API
 * [POST] /receipt
 * 
 */

 // https://teachablemachine.withgoogle.com/models/BLEphcNz1/

 var CryptoJS = require("crypto-js"); 
 var SHA256 = require("crypto-js/sha256"); 
 var Base64 = require("crypto-js/enc-base64");

 exports.getReceiptRecognition = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const {format, imgUrl} = req.body;

    if(!format)
        return res.send(resFormat());
    if(!imgUrl)
        return res.send(resFormat());

    var formats = ["jpg", "jpeg", "png", "bmp"];
    if(!formats.includes(format))
        return res.send(resFormat(false, 203, "지원하는 사진형식이 아닙니다"));

    var reimg = /^([\S]+((i?).(jpg|png|jpeg|bmp)))/;
    if(!reimg.test(imgUrl))
        return res.send(resFormat(false, 204, "이미지URL 형식이 잘못되었습니다."));

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

            // 5번 제한
                var limit = await mainProvider.retrieveReceiptCount(userId);
                if(limit[0].count > 4)
                    return res.send(errResponse(baseResponse.ALREADY_RECEIPT_LIMIT));
 // format + url 을 바꿔줘야 함
 var resultCode = 404; 
 const date = Date.now().toString(); 
 var result = [];

 const secretKey = process.env.NAVER_OCR_SECRET_KEY; 
 const method = "POST"; 
 const space = " "; 
 const newLine = "\n"; 
 const url = `https://a7104b4f31c94067a7fcea1f0373f365.apigw.ntruss.com/custom/v1/9680/ca7c9190886cec68a6b65a143fdd17047236e7f88d64c5be0b8ae7c628d488a4/general`; 

 const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey); 
 
 hmac.update(method); 
 hmac.update(space); 
 hmac.update(newLine); 
 hmac.update(date); 
 hmac.update(newLine); 

 const hash = hmac.finalize(); 
 const signature = hash.toString(CryptoJS.enc.Base64); 
 request( 
     { method: method, 
     json: true, 
     uri: url, 
     headers: { 
         "Contenc-type": "application/json", 
         "X-OCR-SECRET": secretKey, 
     }, 
     body: { 
         "images": [
             {
                 "format": `${format}`,
                 "name": "medium",
                 "data": null,
                 "url": `${imgUrl}`
             }
             ],
             "lang": "ko",
             "requestId": "string",
             "resultType": "string",
             "timestamp": `${date}`,
             "version": "V1"
         }
 }, function (err, res, html) { 
 if (err) {
     // console.log(err); 
     // 에러 호출
 }
 else { 
     resultCode = 200; 



     var regExp =  /^[0-9]+$/;
     var receipt = [ "제품명", "(할인내역)", "(할인금액)", "총매출액" ,"과세금액", "상품명", "단가", "수량", "금액", "합계금액", "과세매출", "부가세", "신용카드승인", "받은금액","상호", "사업자번호", "대표자", "주소", "전화번호", "매출전표", "계산원", 
     "부 가 세", "부 가", "가 세", "총 품목 수량", "면세 물품", "과세 물품", "합 계", "과 세 금 액", "총 매 출 액", "합 계 금 액", 
     "(지출증빙)", "[구매]", "단 가", "POS", "과세", "매출", "물품", "품명", "할인", "소 계", "순 매 출", "봉 사 료", "매출합계(카드)","가세", "부가",
     "[카 드 번 호]", "[할 부 개 월]", "[카 드 사 명]", "[승 인 번 호]", "[결 제 금 액]", "카드결제(IC)", 
     "(*)면 세 물 품", "과 세 물 품", "결 제 대 상 금 액", "합계수량/금액", "결제대상금액"];
     
     var bank = ["신한", "KB국민", "새마을금고", "우리", "하나"];
     
     
     var fruit = [ "메론", "사과", "레몬", "체리", "포도", "망고", "블루베리",
                 "귤", "감", "딸기", "아보카도", "바나나", "토마토", "방울토마토", "배",
                 "복숭아", "석류", "수박", "오렌지", "자두", "자몽", "참외", "천도복숭아", "키위",
                 "파인애플", "한라봉", "홍시", "거봉" ];
     
     var vegetable = [ "계란", "다진마늘", "마늘", "감자", "도라지", "마", "양파", "생강", 
                     "단호박", "당근", "콩나물", "옥수수", "나물", "부추", "파", "브로콜리",
                     "무", "비트", "상추", "새싹채소", "샐러드", "미나리", "바질", "곤드레",
                     "깻잎", "배추", "양배추", "버섯", "양배추", "버섯", "표고버섯", "건버섯",
                     "고사리", "고구마", "건나물", "고추", "홍고추", "가지", "건포도" ];

     var meat = [ "갈비", "닭고기", "소고기", "양고기", "오리고기", "돼지고기", "계란", "메추리알", "베이컨"];
     
     var fish = [ "건어물", "회", "고등어", "생선", "삼치", "꽁치", "조기", "멸치", "오징어", "쭈꾸미",
                  "바지락", "조개", "굴", "전복", "김", "다시마", "미역", "새우", "게", "연어", "문어" ];

     var re1 = /^[0-9]+ml$/;
     var re2 = /^[0-9]+g$/;


     var count = 0;
     //console.log(html.images[0].fields.length);
     html.images[0].fields.forEach((field , index) => {
         if(field.inferConfidence > 0.9 ){
             var text = (field.inferText).replace(",", "");
             text = (text).replace(" ", "");
             text = (text).replace("*", "");
             
             if(text && (text != "") && !regExp.test(Number(text)) && text.length > 1 
             && !(receipt.includes(text)) && !(bank.includes(text))
                 && !(re1.test(text)) && !(re2.test(text))){
             
                 // console.log(text);
                 if(text.includes('('))
                     text = text.substring(0, field.inferText.indexOf('('));

                 if(text.includes('/'))
                     text = text.substring(0, field.inferText.indexOf('/'));

                 if(fruit.includes(text)){
                     const index1 = fruit.indexOf(text);
                     text = fruit[index1];
                 }

                 if(vegetable.includes(text)){
                     const index2 = vegetable.indexOf(text);
                     text = vegetable[index2];
                 }
                 // if(meat.includes(text)){
                 //     const index3 = meat.indexOf(text);
                 //     text = meat[index3];
                 // }
                 // if(fish.includes(text)){
                 //     const index4 = fish.indexOf(text);
                 //     text = fish[index4];
                 // }

                 result[count] = text;
                 count += 1;

                 }
             }
         })
     };
     
 });

 // 영수증 일주일에 5번 사용 제한
 async function receiptLimit(userId){
     const receiptLimit = await mainService.receiptLimit(userId);
     if(receiptLimit == baseResponse.DB_ERROR)
         return res.send(errResponse(baseResponse.DB_ERROR));
 }
 await receiptLimit(userId);

 setTimeout(function(){
     return res.status(200).send({ isSuccess:true, code:1000, message:"영수증 인식 완료!", "result" : result});
 }, 3000);
// } else {
//     return res.send(errResponse(baseResponse.INPUT_RECEIPT));
// }
          let responseData = resFormat(true, 100, "자체 회원가입 성공 완료!");
          connection.release();
          return res.json(responseData);
        } catch (err) {
          // await connection.rollback(); // ROLLBACK
          connection.release();
          logger.error(`App - User SignUp Ver1 Query error\n: ${err.message}`);
          return res.json(resFormat(false, 500, "User SignUp Ver1 Query error"));
        }
      } catch (err) {
        logger.error(`App - User SignUp Ver1 DB Connection error\n: ${err.message}`);
        return res.json(resFormat(false, 501, "User SignUp Ver1 DB Connection error"));
      }

    
   

   
}

/**
 * API No. 20. 
 * API Name : 식재료 업로드 API (식재료 + 수량 + 유통기한 설정)
 * [POST] /fridge/user/:userId/count/:count/product/place/:place
 * 
 */

exports.registerProduct = async function (req, res) {
    const myId = req.verifiedToken.userId; // 내 아이디
   // console.log(myId);
    const { userId, count, place } = req.params;
    const { array } = req.body;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(myId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 친구 체크
    if(myId != userId){
        // 해당하는 id 가 친구 목록에 있는지 확인
        const statusFriendCheck = await userProvider.checkFriendStatus(myId, userId);
        if(statusFriendCheck[0].exist == 0)
            return res.send(errResponse(baseResponse.INVALID_ACCESS_FRIEND));
        
        const statusFriendCheck2 = await userProvider.checkFriendStatus2(myId);
        if(statusFriendCheck2.length < 1)
            return res.send(errResponse(baseResponse.INVALID_ACCESS_FRIEND));

    }

    // 카운트
    if(!count || !Number(count))
    return res.send(errResponse(baseResponse.COUNT_INPUT_NUMBER));

    // 공백 체크
    var re = /^ss*$/;
    if(re.test(count))
        return res.send(errResponse(baseResponse.COUNT_INPUT_NUMBER));

    if(count > 4)
    return res.send(errResponse(baseResponse.COUNT_EXCEED_NUMBER));

    // array
    if(!array || re.test(array))
        return res.send(errResponse(baseResponse.INPUT_ARRAY));

    if(array.length < 1)
        return res.send(errResponse(baseResponse.INPUT_ARRAY));
    
    // 존재하는 카운트인지 확인
    const fridgeList = await userProvider.existFridgeCount(userId, count);
    if(fridgeList[0].exist === 1){
        
        const fridge = await mainProvider.retrieveFridgeCount(userId, count);
        const fridgeId = fridge.frigeId;
        //console.log(fridge.frigeId, array);
        
        //console.log(fridge.fridgeType, place);
        if(fridge.fridgeType === 1){ 
            if(place != 11 && place != 12 && place != 4)
                return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        } else if(fridge.fridgeType === 2){
            if(place != 11 && place != 12 && place != 21 && place != 22 && place != 4)
            return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));

        } else if(fridge.fridgeType === 3){
            if(place != 1 && place != 2 && place != 4 )
            return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        
        } else if(fridge.fridgeType === 4){
            if(place != 1 && place != 2 && place != 3 && place != 4 )
            return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        
        } else if(fridge.fridgeType === 5){
            if(place != 11 && place != 12 && place != 2 && place != 3 && place != 4 )
            return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        
        } else if(fridge.fridgeType === 6){
            if(place != 11 && place != 12 && place != 13 && place != 4 )
            return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        
        } else {
            return res.send(errResponse(baseResponse.SERVER_ERROR));
        }
        


        let cnt = 0;
        let num = array.length;
        while(cnt < num){
            const productName = array[cnt].name;
            const productCount = array[cnt].count;
            const productDate = array[cnt].date;
            
            if(!String(productName) || !(productName))
                return res.send(baseResponse.INPUT_PRODUCT_NAME);

            if(!productCount || !Number(productCount) || productCount < 1)
                return res.send(baseResponse.INPUT_PRODUCT_COUNT);

            if(!productDate || !Number(productDate))
                return res.send(baseResponse.INPUT_LIMIT_DATE);

            const insertProduct = await mainService.insertProduct(userId, fridgeId, productName, productCount, productDate, place);
            if(insertProduct == baseResponse.DB_ERROR)
                return res.send(errResponse(baseResponse.DB_ERROR));
            
            cnt += 1;
        }

        if(cnt == num)
            return res.send({ isSuccess:true, code:1000, message:"냉장고 식재료 업로드 완료!"});

    } else {
        return res.send(errResponse(baseResponse.NO_EXIST_FRIDGE));
    }

};

/**
 * API No. 21.
 * API Name : 유통기한 날짜(yyyy-mm-dd) => 일 변환 API
 * [GET] /fridge/expiration-date
 * 
 */

exports.selectExpirationDate = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { expirationDate } = req.body;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    var dayRegExp = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
    if(!dayRegExp.test(expirationDate))
        return res.send(errResponse(baseResponse.INVALID_EXPIRATION_DATE));

    const searchList = await mainProvider.selectExpirationDate(expirationDate);
    if(searchList.length < 1)
        return res.send(errResponse(baseResponse.REGISTER_DATE_FAILURE));

    return res.send({ isSuccess:true, code:1000, message:"유통기한 날짜 일 변경 완료!", "result": searchList[0] });

};

/**
 * API No. 22.
 * API Name : 냉장고 상세 페이지 조회 API
 * [GET] /fridge/user/:userId/count/:count/place/:place/detail
 * 
 */

exports.selectFridgeDetail = async function (req, res) {
    const myId = req.verifiedToken.userId; // 내 아이디
    const { userId, count, place } = req.params;
    const size = 120;
    let { page } = req.query;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(myId);
    if(statusCheck.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 친구 체크
    if(myId != userId){
        // 해당하는 id 가 친구 목록에 있는지 확인
        const statusFriendCheck = await userProvider.checkFriendStatus(myId, userId);
        if(statusFriendCheck.length < 1)
            return res.send(errResponse(baseResponse.INVALID_ACCESS_FRIEND));

        const statusFriendCheck2 = await userProvider.checkFriendStatus2(myId);
        if(statusFriendCheck2.length < 1)
            return res.send(errResponse(baseResponse.INVALID_ACCESS_FRIEND));
    }
    
    if(!page)
        return res.send(response(baseResponse.NO_EMPTY_PAGE));

    if(page == 0)
        return res.send(response(baseResponse.INPUT_PAGE_RANGE));

    page = size * (page-1);


    // 카운트
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
        
        const fridge = await mainProvider.retrieveFridgeCount(userId, count);
        const fridgeId = fridge.frigeId;

        if(fridge.fridgeType === 1){ 
            if(place != 11 && place != 12 && place != 4)
                return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        } else if(fridge.fridgeType === 2){
            if(place != 11 && place != 12 && place != 21 && place != 22 && place != 4)
            return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));

        } else if(fridge.fridgeType === 3){
            if(place != 1 && place != 2 && place != 4 )
            return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        
        } else if(fridge.fridgeType === 4){
            if(place != 1 && place != 2 && place != 3 && place != 4 )
            return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        
        } else if(fridge.fridgeType === 5){
            if(place != 11 && place != 12 && place != 2 && place != 3 && place != 4 )
            return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        
        } else if(fridge.fridgeType === 6){
            if(place != 11 && place != 12 && place != 13 && place != 4 )
            return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        
        } else {
            return res.send(errResponse(baseResponse.SERVER_ERROR));
        }
    
        const fridgeDetail = await mainProvider.selectFridgeDetail(userId, fridgeId, place, page, size);
        if(fridgeDetail.length < 1)
            return res.send(errResponse(baseResponse.FRIDGE_PLACE_EMPTY));

        return res.send({ isSuccess:true, code:1000, message:"냉장고 상세 페이지 조회 완료!", "fridge" : { "fridgeType" : fridge.fridgeType , "place" : Number(place) }, "result" : fridgeDetail });

    } else {
        return res.send(errResponse(baseResponse.NO_EXIST_FRIDGE));
    }
};


/**
 * API No. 45.
 * API Name : 냉장고 속 식재료 조회 API 
 * [GET] /fridge/search
 * 
 */

 exports.selectProduct = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const search = req.query.product;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

      // 공백 체크
    var re = /^ss*$/;
    if(!search || re.test(search))
        return res.send(errResponse(baseResponse.INPUT_PRODUCT_SEARCH));

    if(!String(search))
        return res.send(errResponse(baseResponse.INPUT_STRING));

    const searchList = await mainProvider.selectFridgeBySearch(userId, search);
    if(searchList.length < 1)
        return res.send(errResponse(baseResponse.NO_SEARCH_RESULT));

    const mySearch = await mainProvider.existMySearch(userId, search);
    if(mySearch.length < 1){
        try {
            const connection = await pool.getConnection(async (conn) => conn);
            const searchUpload = await mainDao.insertSearch(connection, userId, search);
            console.log(`최근 검색어 업로드  : ${searchUpload.insertId}`)
            connection.release();

        } catch (err) {
            logger.error(`App - Insert Search Service error\n: ${err.message}`);
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    return res.send({ isSuccess:true, code:1000, message:"냉장고 속 식재료 조회 완료!", "result": searchList });

};

/**
 * API No. 25. 
 * API Name : 최근 검색어 조회 API
 * [GET] /fridge/my-search
 * 
 */

 exports.RecentSearch = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    const searchList = await mainProvider.selectSearchList(userId);
    if(searchList.length < 1)
        return res.send(errResponse(baseResponse. NO_RECENT_SEARCH));

    return res.send({ isSuccess:true, code:1000, message:"최근 검색어 조회 완료!", "result": searchList });

};


/**
 * API No. 26.
 * API Name : 최근 검색어 전체 지우기  API
 * [PATCH] /fridge/my-search
 * 
 */

 exports.DeleteSearch = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 검색어 삭제
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const searchResult = await mainDao.deleteSearch( connection, userId );
        connection.release();
        //console.log(listInfo);
        return res.send(response({ isSuccess:true, code:1000, message:"최근 검색어 전체 지우기 완료!" }));  
    } catch (error) {
        return res.send(errResponse(baseResponse.SERVER_ERROR));
    }

};



 

 /**
 * API No. 42.
 * API Name : 냉장고 Home 화면 API (+유통기한별 상품 표시)
 * [GET] /fridge/user/:userId/count/:count
 * 
 */

  exports.selectMainHome = async function (req, res) {
    const myId = req.verifiedToken.userId; // 내 아이디
    const { userId , count } = req.params;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(myId);
    if(statusCheck.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 친구 체크
    if(myId != userId){
        // 해당하는 id 가 친구 목록에 있는지 확인
        const statusFriendCheck = await userProvider.checkFriendStatus(myId, userId);
        if(statusFriendCheck.length < 1)
            return res.send(errResponse(baseResponse.INVALID_ACCESS_FRIEND));
    
        const statusFriendCheck2 = await userProvider.checkFriendStatus2(myId);
        if(statusFriendCheck2.length < 1)
            return res.send(errResponse(baseResponse.INVALID_ACCESS_FRIEND));
    }

    // 카운트
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
    var totalData = [];

    if(fridgeList[0].exist === 1){
        
        const fridge = await mainProvider.retrieveFridgeCount(userId, count);
        //console.log(fridge);

        const fridgeId = fridge.frigeId;
        
        var list1 = [11, 12];
        var list2 = [11, 12, 21, 22];
        var list3 = [1, 2];
        var list4 = [1, 2, 3];
        var list5 = [11, 12, 2, 3];
        var list6 = [11, 12, 13];

        var n1 = 8;

        var n2 = 4;
        var n3 = 4;

        var n41 = 4;
        var n423 = 2;

        var n512 = 4;
        var n534 = 2;

        var n6 = 6;

        if(fridge.fridgeType == 1){
            let idx = 0;
            async function processArray(list1){
                for (const place of list1) {
                    const productInfo = await mainProvider.selectFridgeHome1(userId, fridgeId, place, n1);
                    var result = {"place" : place , productInfo };
                    //console.log(result);
                    totalData[idx] = result;
                    idx += 1;
                };
            }
            await processArray(list1);
            return res.send({ isSuccess:true, code:1000, message:"냉장고 전체화면 조회 완료!" , "fridge" : { "fridgeType" : fridge.fridgeType  },  "result" : totalData });

        } else if(fridge.fridgeType == 2){
            let idx = 0;
            async function processArray(list2){
                for (const place of list2) {
                    const productInfo = await mainProvider.selectFridgeHome2(userId, fridgeId, place, n2);
                    var result = {"place" : place , productInfo };
                    //console.log(productInfo);
                    totalData[idx] = result;
                    idx += 1;
                };
            }
            await processArray(list2);
            return res.send({ isSuccess:true, code:1000, message:"냉장고 전체화면 조회 완료!" , "fridge" : { "fridgeType" : fridge.fridgeType  },  "result" : totalData });
            
        } else if(fridge.fridgeType == 3){
            let idx = 0;
            async function processArray(list3){
                for (const place of list3) {
                    const productInfo = await mainProvider.selectFridgeHome3(userId, fridgeId, place, n3);
                    var result = {"place" : place , productInfo };
                    //console.log(result);
                    totalData[idx] = result;
                    idx += 1;
                };
            }
            await processArray(list3);
            return res.send({ isSuccess:true, code:1000, message:"냉장고 전체화면 조회 완료!" , "fridge" : { "fridgeType" : fridge.fridgeType  },  "result" : totalData });

        } else if(fridge.fridgeType == 4){
            let idx = 0;
            async function processArray(list4){
                for (const place of list4) {
                    if(place == 1){
                        const productInfo = await mainProvider.selectFridgeHome41(userId, fridgeId, place, n41);
                        var result = {"place" : place , productInfo };
                        //console.log(result);
                        totalData[idx] = result;
                        idx += 1;
                    } else {
                        const productInfo = await mainProvider.selectFridgeHome423(userId, fridgeId, place, n423);
                        var result = {"place" : place , productInfo };
                        //console.log(result);
                        totalData[idx] = result;
                        idx += 1;
                    }
                };
            }
            await processArray(list4);
            return res.send({ isSuccess:true, code:1000, message:"냉장고 전체화면 조회 완료!" , "fridge" : { "fridgeType" : fridge.fridgeType  },  "result" : totalData });

        } else if(fridge.fridgeType == 5){
            let idx = 0;
            async function processArray(list5) {
                for (const place of list5) {
                    if(place == 11 || place == 12){
                        const productInfo = await mainProvider.selectFridgeHome512(userId, fridgeId, place, n512);
                        var result = {"place" : place , productInfo };
                        //console.log(result);
                        totalData[idx] = result;
                        idx += 1;
                    } else {
                        const productInfo = await mainProvider.selectFridgeHome534(userId, fridgeId, place, n534);
                        var result = {"place" : place , productInfo };
                        //console.log(result);
                        totalData[idx] = result;
                        idx += 1;
                    }

                };
            }
            await processArray(list5);
            return res.send({ isSuccess:true, code:1000, message:"냉장고 전체화면 조회 완료!" , "fridge" : { "fridgeType" : fridge.fridgeType  },  "result" : totalData });

        } else if(fridge.fridgeType == 6){
            let idx = 0;
            async function processArray(list6){
                for (const place of list6) {
                    const productInfo = await mainProvider.selectFridgeHome6(userId, fridgeId, place, n6);
                    var result = {"place" : place , productInfo };
                    //console.log(result);
                    totalData[idx] = result;
                    idx += 1;
                    };
                }
            await processArray(list6);
            return res.send({ isSuccess:true, code:1000, message:"냉장고 전체화면 조회 완료!" , "fridge" : { "fridgeType" : fridge.fridgeType  },  "result" : totalData });
        } else {
            return res.send(errResponse(baseResponse.SERVER_ERROR));
        }

        
    } else {
        return res.send(errResponse(baseResponse.NO_EXIST_FRIDGE));
    }

};


 /**
 * API No. 43.
 * API Name : 냉장고 식재료 수량 | 유통기한 수정 API
 * [PATCH] /fridge/user/:userId/count/:count/place/:place/product-info/:productId
 * 
 */
  exports.updateProductInfo = async function (req, res) {
    const myId = req.verifiedToken.userId; // 내 아이디
    const { userId, count, place, productId } = req.params;
    const { productDate , productCount } = req.body;


    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(myId);
    if(statusCheck.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 친구 체크
    if(myId != userId){
        // 해당하는 id 가 친구 목록에 있는지 확인
        const statusFriendCheck = await userProvider.checkFriendStatus(myId, userId);
        if(statusFriendCheck.length < 1)
            return res.send(errResponse(baseResponse.INVALID_ACCESS_FRIEND));
    
        const statusFriendCheck2 = await userProvider.checkFriendStatus2(myId);
        if(statusFriendCheck2.length < 1)
            return res.send(errResponse(baseResponse.INVALID_ACCESS_FRIEND));
    
    }

    // 카운트
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
        
        const fridge = await mainProvider.retrieveFridgeCount(userId, count);
        const fridgeId = fridge.frigeId;
        
        
        if(fridge.fridgeType === 1){ 

            if(place != 11 && place != 12 && place != 4)
                return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        } else if(fridge.fridgeType === 2){

            if(place != 11 && place != 12 && place != 21 && place != 22 && place != 4)
                return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        } else if(fridge.fridgeType === 3){
            
            if(place != 1 && place != 2 && place != 4 )
                return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        } else if(fridge.fridgeType === 4){

            if(place != 1 && place != 2 && place != 3 && place != 4 )
                return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        } else if(fridge.fridgeType === 5){

            if(place != 11 && place != 12 && place != 2 && place != 3 && place != 4 )
                return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        } else if(fridge.fridgeType === 6){

            if(place != 11 && place != 12 && place != 13 && place != 4 )
                return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        } else {
            return res.send(errResponse(baseResponse.SERVER_ERROR));
        }

        // place에 productId가 있는지 + 이미 삭제된
        const product = await mainProvider.existProductIdInPlace(userId, fridgeId, place, productId);
        if(product[0].exist > 0){
            
            if(!productCount && !productDate) {
                // 식재료 상세 정보 조회
                const productDetailInfo = await mainProvider.productDetailInfo(productId);
                return res.send({ isSuccess:true, code:1000, message:"식재료 상세정보 수정 및 조회 완료!", "fridge" : { "fridgeType" : fridge.fridgeType , "place" : Number(place), "productId" : Number(productId)  }, "result" : productDetailInfo  });
            
            } else if(productCount && productDate){
                // 식재료 정보 업데이트 및 상세정보 조회
                if(!Number(productCount) || productCount < 1)
                    return res.send(errResponse(baseResponse.INPUT_PRODUCT_COUNT));
                
                else if(!Number(productDate))
                    return res.send(errResponse(baseResponse.INPUT_LIMIT_DATE));

                const updateProduct = await mainService.updateProduct(productId, productCount, productDate);
                if(updateProduct == baseResponse.DB_ERROR)
                    return res.send(errResponse(baseResponse.DB_ERROR));

                const productDetailInfo = await mainProvider.productDetailInfo(productId);
                return res.send({ isSuccess:true, code:1000, message:"식재료 상세정보 수정 및 조회 완료!", "fridge" : { "fridgeType" : fridge.fridgeType , "place" : Number(place), "productId" : Number(productId)   }, "result" : productDetailInfo  });
                
            }else{
                if(!productCount){
                    return res.send(errResponse(baseResponse.INPUT_PRODUCT_COUNT));
                } else if(!productDate){
                    return res.send(errResponse(baseResponse.INPUT_LIMIT_DATE));
                }
            }
        
        } else {
            return res.send(errResponse(baseResponse.NOT_DELETE_PRODUCT));
        }

    } else {
        return res.send(errResponse(baseResponse.NO_EXIST_FRIDGE));
    }

};
 /**
 * API No. 44.
 * API Name : 냉장고 식재료 삭제 API
 * [PATCH] /fridge/user/:userId/count/:count/place/:place/product-delete/:productId
 * 
 */
exports.deleteProduct = async function (req, res) {
    const myId = req.verifiedToken.userId; // 내 아이디
    const { userId, count, place, productId } = req.params;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(myId);
    if(statusCheck.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 친구 체크
    if(myId != userId){
        // 해당하는 id 가 친구 목록에 있는지 확인
        const statusFriendCheck = await userProvider.checkFriendStatus(myId, userId);
        if(statusFriendCheck.length < 1)
            return res.send(errResponse(baseResponse.INVALID_ACCESS_FRIEND));
    
        const statusFriendCheck2 = await userProvider.checkFriendStatus2(myId);
        if(statusFriendCheck2.length < 1)
            return res.send(errResponse(baseResponse.INVALID_ACCESS_FRIEND));
    
    }

    // 카운트
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
        
        const fridge = await mainProvider.retrieveFridgeCount(userId, count);
        const fridgeId = fridge.frigeId;
        
        
        if(fridge.fridgeType === 1){ 

            if(place != 11 && place != 12 && place != 4)
                return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        } else if(fridge.fridgeType === 2){

            if(place != 11 && place != 12 && place != 21 && place != 22 && place != 4)
                return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        } else if(fridge.fridgeType === 3){
            
            if(place != 1 && place != 2 && place != 4 )
                return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        } else if(fridge.fridgeType === 4){

            if(place != 1 && place != 2 && place != 3 && place != 4 )
                return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        } else if(fridge.fridgeType === 5){

            if(place != 11 && place != 12 && place != 2 && place != 3 && place != 4 )
                return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        } else if(fridge.fridgeType === 6){

            if(place != 11 && place != 12 && place != 13 && place != 4 )
                return res.send(errResponse(baseResponse.INVALID_INPUT_PLACE));
        } else {
            return res.send(errResponse(baseResponse.SERVER_ERROR));
        }

        // place에 productId가 있는지 + 이미 삭제된
        const product = await mainProvider.existProductIdInPlace(userId, fridgeId, place, productId);
        if(product[0].exist > 0){
            
            const deleteProduct = await mainService.deleteProduct(userId, fridgeId, place, productId);
            if(deleteProduct == baseResponse.DB_ERROR)
                return res.send(errResponse(baseResponse.DB_ERROR));

            return res.send({ isSuccess:true, code:1000, message:"냉장고 식재료 삭제 완료!", "fridge" : { "fridgeType" : fridge.fridgeType , "place" : Number(place) }, "result" : { "productId" : productId } });
        
        } else {
            return res.send(errResponse(baseResponse.NOT_DELETE_PRODUCT));
        }

    } else {
        return res.send(errResponse(baseResponse.NO_EXIST_FRIDGE));
    }

};



/**
 * API No. 62. 
 * API Name : [냉장고 선택] 친구 냉장고 조회 API
 * [GET] /friend-fridge
 * 
 */

 exports.SelectFriendFridge = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));


    const fridgeList = await mainProvider.selectFriendFridge(userId);
    if(fridgeList.length < 1)
        return res.send(errResponse(baseResponse.NO_SELECTABLE_FRIDGE));

    return res.send({ isSuccess:true, code:1000, message:"냉장고 선택 조회 완료!", "result": fridgeList });

};