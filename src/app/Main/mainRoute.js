module.exports = function(app){
    const main = require('./mainController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 19. 영수증 인식 API
    app.post('/receipt', jwtMiddleware,  main.getReceiptRecognition);

    // 20. 식재료 업로드 (식재료 + 수량 + 유통기한 설정) API
    app.post('/fridge/user/:userId/count/:count/product/place/:place', jwtMiddleware, main.registerProduct);

    // 21. 유통기한 날짜(yyyy-mm-dd) => 일 변환 API
    app.get('/fridge/expiration-date', jwtMiddleware, main.selectExpirationDate);
    
    // 22. 냉장고 상세 페이지 조회 API
    app.get('/fridge/user/:userId/count/:count/place/:place/detail', jwtMiddleware, main.selectFridgeDetail);

    // 42. 냉장고 Home 화면 API (+유통기한별 상품 표시)
    app.get('/fridge/user/:userId/count/:count', jwtMiddleware, main.selectMainHome);

    // 43. 냉장고 식재료 수량 | 유통기한 수정 API
    app.patch("/fridge/user/:userId/count/:count/place/:place/product-info/:productId", jwtMiddleware, main.updateProductInfo);

    // 44. 냉장고 식재료 삭제 API
    app.patch("/fridge/user/:userId/count/:count/place/:place/product-delete/:productId", jwtMiddleware, main.deleteProduct);
    
    // 25. 냉장고 속 식재료 조회 API (+위치 | 유통기한 정보)
    app.get('/fridge/search', jwtMiddleware, main.selectProduct);

    // 26.최근 검색어 조회 API
    app.get('/fridge/my-search', jwtMiddleware, main.RecentSearch);

    // 27. 냉장고 타입 설정 API
    app.patch("/fridge/my-search", jwtMiddleware, main.DeleteSearch);

    // 62. [냉장고 선택] 친구 냉장고 조회 API
    app.get('/friend-fridge', jwtMiddleware, main.SelectFriendFridge);

};