module.exports = function(app){
    const waste = require('./wasteController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 50. 음쓰 배출량 간편 조회 API =>  homepage비로그인
    app.get('/user/food-waste/month/:month', jwtMiddleware,  waste.SelectWaste);

    // 51. 음쓰 배출량 간편 조회 API =>  homepage비로그인
    app.get('/user/food-price', jwtMiddleware,  waste.SelectPrice);

    // 52. RFID 음식물 쓰레기 사용자 정보 저장 API
    app.post('/user/food-waste/info-setting', jwtMiddleware, waste.saveWasteInfo);

};