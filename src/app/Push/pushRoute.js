module.exports = function(app){
    const push = require('./pushController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 54. 유통기한 푸시알림 API
    app.post('/push-alarm', jwtMiddleware, push.pushAlarm);

    // 48. 친구 추가 설정 API
    app.post('/friend/user/:userId', jwtMiddleware, push.AddFriend);

    // 49. 친구 삭제 설정 API
    app.patch('/friend/user/:userId', jwtMiddleware, push.updateFriend);

    // 57. 유저의 친구 정보 조회 API /user/friend-info
    app.get('/user/friend-info', jwtMiddleware, push.getUserFriend);


};