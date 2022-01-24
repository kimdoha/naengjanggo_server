module.exports = function(app){
    const com = require('./comController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 23. 글 작성 API
    app.post('/com/category/:category', jwtMiddleware, com.insertPost);

    // 24. [꿀팁공유] 전체 화면 조회 API
    app.get('/com/view/category/:category', jwtMiddleware, com.TipShare);

    // 25. 글 세부 조회 API - 조회수도 같이 작업
    app.get('/com/view/category/:category/post/:postId', jwtMiddleware, com.PostDetail);

    // 26. 북마크 설정 및 해제 API
    app.post('/com/bookmark/category/:category/post/:postId', jwtMiddleware, com.postJjim);

    // 27. 글 수정 API
    app.patch("/com/category/:category/post/:postId", jwtMiddleware, com.PatchPost);

    // 28. 글 삭제 API
    app.patch("/com/delete/category/:category/post/:postId", jwtMiddleware, com.deletePost);
    
    // 29. 찜 - 커뮤니티 글 조회 API
    app.get('/jjim/post', jwtMiddleware, com.JjimPost);

    // 31. 신고하기 - 해당 글 삭제 
    app.post('/declaration/post/:postId', jwtMiddleware, com.Declaration);

};