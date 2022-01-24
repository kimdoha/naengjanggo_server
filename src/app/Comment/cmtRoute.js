module.exports = function(app){
    const cmt = require('./cmtController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 32. 댓글 작성 API
    app.post('/cmt/category/:category/post/:postId', jwtMiddleware, cmt.PostComment);

    // 33. 대댓글 작성 API
    app.post('/cmt/category/:category/post/:postId/comment/:commentId', jwtMiddleware, cmt.PostReComment);

    // 34. 댓글 조회 API
    app.get('/cmt/category/:category/post/:postId', jwtMiddleware, cmt.selectComment);
    
    // 35. 대댓글 조회 API
    app.get('/cmt/category/:category/post/:postId/comment/:commentId', jwtMiddleware, cmt.selectReComment);

    // 36. 댓글 좋아요 API
    app.post('/cmt/like/category/:category/post/:postId/comment/:commentId', jwtMiddleware, cmt.LikeComment);

    // 37. 대댓글 좋아요 API
    app.post('/cmt/like/category/:category/post/:postId/comment/:commentId/comments/:commentsId', jwtMiddleware, cmt.Like2Comment);

    // 38. 댓글 삭제 API
    app.patch('/cmt/delete/category/:category/post/:postId/comment/:commentId', jwtMiddleware, cmt.deleteComment);

    // 39. 대댓글 삭제 API
    app.patch('/cmt/delete/category/:category/post/:postId/comment/:commentId/comments/:commentsId', jwtMiddleware, cmt.deleteReComment);

    // 40. 댓글 편집 API
    app.patch('/cmt/category/:category/post/:postId/comment/:commentId', jwtMiddleware, cmt.patchComment);

    // 41. 대댓글 편집 API
    app.patch('/cmt/category/:category/post/:postId/comment/:commentId/comments/:commentsId', jwtMiddleware, cmt.patchReComment);

};