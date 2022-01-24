module.exports = function(app){
    const rcp = require('./recipeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 58. 레시피 조회 API
    app.get('/user/recipe', jwtMiddleware, rcp.getUserRecipe);

    // 7. 레시피 찜 설정 API
    app.post('/user/recipe/:recipeId', jwtMiddleware, rcp.likeRecipe);

    // 61. 레시피 상세 조회 API
    app.get('/user/recipe/detail/:recipeId', jwtMiddleware, rcp.detailRecipe);

    // 59. 레시피 검색 API
    app.get('/user/recipe/search', jwtMiddleware, rcp.searchRecipe);

    // 30. 찜 - 레시피 조회 API
    app.get('/jjim/recipe', jwtMiddleware, rcp.getJjimRecipe);
    
};