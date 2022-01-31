module.exports = function(app){
    const mypg = require('./mypageController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 55. 내가 쓴 글 조회 API ( + 필터 )
    app.get('/com/my-view/category/:category', jwtMiddleware, mypg.getMyPostLists);

    // 56. 유통기한 알림 설정 API
    app.patch('/users/shelf-life/alarm-diff/:day', jwtMiddleware, mypg.setAlarmDiffByShelfLife);

    // 53. 댓글 알림 설정 API
    app.patch('/users/setpush/comment', jwtMiddleware, mypg.setPushComment);

    // 60. 댓글 및 유통기한 설정 조회 API
    app.get('/users/setpush', jwtMiddleware, mypg.selectMyAlarm);

    // 8. 냉장고 타입 수정 API
    app.patch('/users/fridge/:count/type/:type', jwtMiddleware, mypg.setFridgeType);

    // 9.냉장고 삭제 API
    app.patch('/users/fridge/count/:count', jwtMiddleware, mypg.deleteFridge);

    // 6. 회원탈퇴 API
    app.patch('/user/signout', jwtMiddleware, mypg.signOut);

};