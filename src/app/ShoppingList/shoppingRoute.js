module.exports = function(app){
    const shop = require('./shoppingController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 14. 식재료 추가 API
    app.post('/shoppinglist/product', jwtMiddleware, shop.insertList);

    // 15. 식재료 삭제 API
    app.post('/shoppinglist/product-delete/:listId', jwtMiddleware, shop.deleteList);

    // 16. 장보기 리스트 조회 API (+날짜별)
    app.get('/shoppinglist', jwtMiddleware, shop.selectList);

    // 17. 장보기 리스트 조회 API (+날짜별)
    app.get('/shoppinglist/month', jwtMiddleware, shop.listByMonth);

    // 18. 냉장고 타입 설정 API
    app.get("/shoppinglist/product-message", jwtMiddleware, shop.searchProduct);


};