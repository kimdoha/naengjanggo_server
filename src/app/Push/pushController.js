//const request = require('request');
const { pool } = require("../../../config/database");

const jwtMiddleware = require("../../../config/jwtMiddleware");
const pushProvider = require("./pushProvider");
const pushService = require("./pushService");
const pushDao = require("./pushDao");
const userProvider = require("../User/userProvider");

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const { connect } = require("http2");

const regexEmail = require("regex-email");
const {emit, addListener} = require("nodemon");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");



/**
 * API No. 54. 
 * API Name : 유통기한 푸시알림 (7일전 | 3일전 | 1일전) API
 * [GET] /push-alarm
 * 
 */
 exports.pushAlarm = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

     // 유저 체크
     const statusCheck = await userProvider.checkUserStatus(userId);
     if(statusCheck.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
      
      var admin = require("firebase-admin");
      var serviceAccount = require("../../../config/comon-f8610-firebase-adminsdk-fvu0e-9aadd26826.json");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });

      var dayList = [ 7, 6, 5, 4, 3, 2, 1];


      async function fcmMessageSendFunction(dayList){
        for (const day of dayList) {
            // 유저 리스트의 유저 등록 토큰을 가지고
            // 식재료 이름 외 몇개를 메세지 보내기
            // 유저가 유통기한 알람을 설정했는지 확인
            const userInfo = await pushProvider.selectPushAlarmUser(day);
            if(userInfo.length > 0){
                let cnt = 0;
                let num = userInfo.length;
                while(cnt < num){
                    let user = userInfo[cnt].userId;
                    let registrationToken = userInfo[cnt].registrationToken;
                    let fcm = await pushProvider.selectMessage(user, day);
                    //console.log(fcm[0].message);

                    var fcm_target_token = `${registrationToken}`;
                    var fcm_message = { 
                            notification: { 
                                title: '🤭 유통기한 알림', 
                                body: `${fcm[0].message}`
                            }, 
                            data:{ 
                                fileno:'44', 
                                style:'' 
                            },
                            token: fcm_target_token
                    
                        }; // 메시지를 보내는 부분 입니다. 
                            
                        admin.messaging().send(fcm_message) 
                            .then(function( response ){ 
                                console.log('보내기 성공 메시지:' + response); 
                            }) .catch(function( error ){ 
                                console.log( '보내기 실패 메시지:' + error ); 
                        });

                    cnt += 1;
                }
            } 


        };
    }
    const fcmMessage = await fcmMessageSendFunction(dayList);
    return res.send({ isSuccess:true, code:1000, message:"유통기한 푸시 알림 전체 완료!" });

};


/**
 * API No. 48. 
 * API Name : 친구 추가 API
 * [POST] /friend/user/:userId
 * 
 */

 exports.AddFriend = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const friendId = req.params.userId;

    // 공백 체크
     var re = /^ss*$/;
    if(!friendId || re.test(friendId))
        return res.send(errResponse(baseResponse.INPUT_FRIENDID));

    if(!Number(friendId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));
    
    // 유저 체크
    const statusCheck1 = await userProvider.checkUserStatus(userId);
    if(statusCheck1.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    
    // 상대 유저 체크
    const statusCheck2 = await userProvider.checkUserStatus(friendId);
    if(statusCheck2.length < 1)
        return res.send(errResponse(baseResponse.FRIEND_INACTIVE_ACCOUNT));

    // 본인의 경우
    if(friendId == userId)
        return res.send(errResponse(baseResponse.NOT_FRIEND_ACCESS));

    // 이미 친구인 경우
    var friend = await pushProvider.selectFriendByFriendId(userId, friendId);
    if(friend[0].exist == 0){
        const Addfriend = await pushService.addFriend(userId, friendId);
    } else {
        var [check] = await pushProvider.selectStatus(userId, friendId);

        if(check.status == 0) 
            var updateStatus = await pushService.patchFriend1(userId, friendId);
        else
            return res.send(errResponse(baseResponse.EXIST_FRIEND));
    }
        
    return res.send({ isSuccess:true, code:1000, message:"친구 추가 완료!", "result": { "userId" : userId, "friendId" : Number(friendId) }});

};


/**
 * API No. 49
 * API Name : 친구 삭제 API
 * [PATCH] /friend/user/:userId
 * 
 */

 exports.updateFriend = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const friendId = req.params.userId;

    // 공백 체크
     var re = /^ss*$/;
    if(!friendId || re.test(friendId))
        return res.send(errResponse(baseResponse.INPUT_FRIENDID));

    if(!Number(friendId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));
    
    // 유저 체크
    const statusCheck1 = await userProvider.checkUserStatus(userId);
    if(statusCheck1.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    
    // 상대 유저 체크
    const statusCheck2 = await userProvider.checkUserStatus(friendId);
    if(statusCheck2.length < 1)
        return res.send(errResponse(baseResponse.FRIEND_INACTIVE_ACCOUNT));

    // 본인의 경우
    if(friendId == userId)
        return res.send(errResponse(baseResponse.NOT_FRIEND_ACCESS));
    
    // 친구가 아닌 경우
    var friend = await pushProvider.selectFriendByFriendId(userId, friendId);
    if(friend[0].exist == 0){
        return res.send(errResponse(baseResponse.NOT_EXIST_FRIEND));
    } else {
        var [check] = await pushProvider.selectStatus(userId, friendId);

        if(check.status == 0) 
            return res.send(errResponse(baseResponse.ALREADY_DELETE));
        else
            var patchfriend = await pushService.patchFriend0(userId, friendId);
    }

    return res.send({ isSuccess:true, code:1000, message:"친구 삭제 완료!", "result": { "userId" : userId, "friendId" : Number(friendId) }});

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
