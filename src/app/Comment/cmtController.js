//const request = require('request');
const { pool } = require("../../../config/database");

const jwtMiddleware = require("../../../config/jwtMiddleware");
const cmtProvider = require("./cmtProvider");
const cmtService = require("./cmtService");
const cmtDao = require("./cmtDao");
const userProvider = require("../User/userProvider");
const comProvider = require("../Community/comProvider");

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const { connect } = require("http2");

const regexEmail = require("regex-email");
const {emit, addListener} = require("nodemon");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");



 
/**
 * API No. 32. 
 * API Name : 댓글 작성 API
 * [POST] /cmt/category/:category/post/:postId
 * 
 */

 exports.PostComment = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { category , postId } = req.params;
    const { content } = req.body;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 공백 체크
    var re = /^ss*$/;
   
    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));

    if (!Number(category) || !Number(postId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    // 해당하는 카테고리에 postId 가 유효한지
    const existPost = await comProvider.selectPostByPostId(category, postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.VALID_CATEGORY_POSTID));

    // content
    if(!content || re.test(content))
        return res.send(errResponse(baseResponse.INPUT_COMMENT_CONTENT));
    
    if(!String(content))
        return res.send(errResponse(baseResponse.INPUT_STRING));
    
    if(content.length > 500)
        return res.send(errResponse(baseResponse.CONTENT_LENGTH));

    const postComment = await cmtService.postComment(userId, postId, content);
    
    const validFcm = await cmtProvider.retrievePostInfo(postId);
    // post 작성자가 알람을 설정
    if(validFcm.length > 0){

        var admin = require("firebase-admin");
        var serviceAccount = require("../../../config/comon-f8610-firebase-adminsdk-fvu0e-9aadd26826.json");
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });

        let title = validFcm[0].title;
        let registrationToken = validFcm[0].registrationToken;

        let message = title + ' 글에 '+'댓글이 달렸습니다';
        
        var fcm_target_token = `${registrationToken}`;
        var fcm_message = { 
                notification: { 
                    title: '✨ 댓글 알림', 
                    body: `${message}`
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
    }

    return res.send({ isSuccess:true, code:1000, message:"댓글 작성 완료!", 
    "result": { 
        "postId" : postId , 
        "userId" : userId, 
        "content" : content }
    });

};


/**
 * API No. 33. 
 * API Name : 대댓글 작성 API
 * [POST] /cmt/category/:category/post/:postId/comment/:commentId
 * 
 */

 exports.PostReComment = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { category , postId, commentId } = req.params;
    const { content } = req.body;

    // 유저 체크
    const statusCheck1 = await userProvider.checkUserStatus(userId);
    if(statusCheck1.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 공백 체크
    var re = /^ss*$/;
   
    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));

    if (!Number(category) || !Number(postId) || !Number(commentId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    // postId
    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    // 해당하는 카테고리에 postId 가 유효한지
    const existPost = await comProvider.selectPostByPostId(category, postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.VALID_CATEGORY_POSTID));


    // commentId
    if(!commentId || re.test(commentId))
        return res.send(errResponse(baseResponse.INPUT_COMMENTID));

    // 해당하는 post에 commentId 가 유효한지
    const existComment = await cmtProvider.selectCommentInPost(postId, commentId);
    if(existComment.length < 1)
        return res.send(errResponse(baseResponse.VALID_POST_COMMENTID));

    // content
    if(!content || re.test(content))
        return res.send(errResponse(baseResponse.INPUT_COMMENT_RECONTENT));
    
    if(!String(content))
        return res.send(errResponse(baseResponse.INPUT_STRING));

    if(content.length > 500)
        return res.send(errResponse(baseResponse.CONTENT_LENGTH));

    const postComment = await cmtService.postReComment(commentId, userId, content);
    
    // postId에 commentId가 유효하다
    const validFcm2 = await cmtProvider.retrievePostInfo(postId);

    // post 작성자에게 알람을 설정
    if(validFcm2.length > 0){

        var admin = require("firebase-admin");
        var serviceAccount = require("../../../config/comon-f8610-firebase-adminsdk-fvu0e-9aadd26826.json");
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });

        let title = validFcm2[0].title;
        let registrationToken = validFcm2[0].registrationToken;

        let message = title + ' 글에 '+'댓글이 달렸습니다';
        
        var fcm_target_token = `${registrationToken}`;
        var fcm_message = { 
                notification: { 
                    title: '✨ 대댓글 알림', 
                    body: `${message}`
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
    }


    return res.send({ isSuccess:true, code:1000, message:"대댓글 작성 완료!", 
    "result": { 
        "postId" : postId , 
        "userId" : userId, 
        "commentId" : commentId,
        "content" : content }
    });
};


/**
 * API No. 34. 
 * API Name : 댓글 조회 API
 * [GET] /cmt/category/:category/post/:postId
 * 
 */

 exports.selectComment = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { category , postId } = req.params;

    // 유저 체크
    const statusCheck1 = await userProvider.checkUserStatus(userId);
    if(statusCheck1.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 공백 체크
    var re = /^ss*$/;
   
    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));

    if (!Number(category) || !Number(postId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    // 해당하는 카테고리에 postId 가 유효한지
    const existPost = await comProvider.selectPostByPostId(category, postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.VALID_CATEGORY_POSTID));


    const commentResult = await cmtProvider.selectComment(postId);
    if(commentResult.length  < 1)
        return res.send(errResponse(baseResponse.EMPTY_COMMENT_RESULT));

    return res.send({ isSuccess:true, code:1000, message:"댓글 조회 완료!", "result": commentResult });

};

/**
 * API No. 35. 
 * API Name : 대댓글 조회 API
 * [POST] /cmt/category/:category/post/:postId/comment/:commentId
 * 
 */

 exports.selectReComment = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { category , postId, commentId } = req.params;


    // 유저 체크
    const statusCheck1 = await userProvider.checkUserStatus(userId);
    if(statusCheck1.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 공백 체크
    var re = /^ss*$/;
   
    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));

    if (!Number(category) || !Number(postId) || !Number(commentId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    // postId
    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    // 해당하는 카테고리에 postId 가 유효한지
    const existPost = await comProvider.selectPostByPostId(category, postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.VALID_CATEGORY_POSTID));


    // commentId
    if(!commentId || re.test(commentId))
        return res.send(errResponse(baseResponse.INPUT_COMMENTID));

    // 해당하는 post에 commentId 가 유효한지
    const existComment = await cmtProvider.selectCommentInPost(postId, commentId);
    if(existComment.length < 1)
        return res.send(errResponse(baseResponse.VALID_POST_COMMENTID));


    const commentResult = await cmtProvider.selectReComment(commentId);
    if(commentResult.length < 1)
        return res.send(errResponse(baseResponse.EMPTY_RECOMMENT_RESULT));

    return res.send({ isSuccess:true, code:1000, message:"대댓글 조회 완료!", "result": commentResult });
};

/**
 * API No. 36. 
 * API Name : 댓글 좋아요 API
 * [POST] /cmt/like/category/:category/post/:postId/comment/:commentId
 * 
 */
exports.LikeComment = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { category, postId, commentId } = req.params;

    // 유저 체크
    const statusCheck1 = await userProvider.checkUserStatus(userId);
    if(statusCheck1.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 공백 체크
    var re = /^ss*$/;
   
    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));

    if (!Number(category) || !Number(postId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    // 해당하는 카테고리에 postId 가 유효한지
    const existPost = await comProvider.selectPostByPostId(category, postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.VALID_CATEGORY_POSTID));

    // commentId
    if(!commentId || re.test(commentId))
        return res.send(errResponse(baseResponse.INPUT_COMMENTID));

    // 해당하는 post에 commentId 가 유효한지
    const existComment = await cmtProvider.selectCommentInPost(postId, commentId);
    if(existComment.length < 1)
        return res.send(errResponse(baseResponse.VALID_POST_COMMENTID));

    const likeComment = await cmtService.likeComment(userId, commentId);
    
    return res.send({ isSuccess:true, code:1000, message:"댓글 좋아요 완료!", 
    "result": { 
        "postId" : postId , 
        "userId" : userId, 
        "commentId" : commentId }
    });

};


/**
 * API No. 37. 
 * API Name : 대댓글 좋아요 API
 * [POST] /cmt/like/category/:category/post/:postId/comment/:commentId/comments/:commentsId
 * 
 */
 exports.Like2Comment = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { category, postId, commentId, commentsId } = req.params;

    // 유저 체크
    const statusCheck1 = await userProvider.checkUserStatus(userId);
    if(statusCheck1.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 공백 체크
    var re = /^ss*$/;
   
    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));

    if (!Number(category) || !Number(postId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    // 해당하는 카테고리에 postId 가 유효한지
    const existPost = await comProvider.selectPostByPostId(category, postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.VALID_CATEGORY_POSTID));

    // commentId
    if(!commentId || re.test(commentId))
        return res.send(errResponse(baseResponse.INPUT_COMMENTID));

    // 해당하는 post에 commentId 가 유효한지
    const existComment = await cmtProvider.selectCommentInPost(postId, commentId);
    if(existComment.length < 1)
        return res.send(errResponse(baseResponse.VALID_POST_COMMENTID));

    // commentsId
    if(!commentsId || re.test(commentsId))
        return res.send(errResponse(baseResponse.INPUT_COMMENTSID));
    
    // 해당하는 commentId 에 commentsId가 유효한지
    const existComments = await cmtProvider.selectCommentsInComment(commentId, commentsId);
    if(existComments.length < 1)
        return res.send(errResponse(baseResponse.VALID_COMMENTID_COMMENTSID));

    const like2Comment = await cmtService.like2Comment(userId, commentsId);
    
    return res.send({ isSuccess:true, code:1000, message:"대댓글 좋아요 완료!", 
    "result": { 
        "postId" : postId , 
        "userId" : userId, 
        "commentId" : commentId,
        "commentsId" : commentsId }
    });

};

/**
 * API No. 38. 
 * API Name : 댓글 삭제 API
 * [POST] /cmt/delete/category/:category/post/:postId/comment/:commentId
 * 
 */
exports.deleteComment = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { category, postId, commentId } = req.params;

    // 유저 체크
    const statusCheck1 = await userProvider.checkUserStatus(userId);
    if(statusCheck1.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 공백 체크
    var re = /^ss*$/;
   
    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));

    if (!Number(category) || !Number(postId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    // 해당하는 카테고리에 postId 가 유효한지
    const existPost = await comProvider.selectPostByPostId(category, postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.VALID_CATEGORY_POSTID));

    // commentId
    if(!commentId || re.test(commentId))
        return res.send(errResponse(baseResponse.INPUT_COMMENTID));

    // 해당하는 post에 commentId 가 유효한지
    const existComment = await cmtProvider.selectCommentInPost(postId, commentId);
    if(existComment.length < 1)
        return res.send(errResponse(baseResponse.VALID_POST_COMMENTID));

    // commentsId
    if(!commentsId || re.test(commentsId))
        return res.send(errResponse(baseResponse.INPUT_COMMENTSID));

    // 해당하는 commentId 에 commentsId가 유효한지
    const existComments = await cmtProvider.selectCommentsInComment(commentId, commentsId);
    if(existComments.length < 1)
        return res.send(errResponse(baseResponse.VALID_COMMENTID_COMMENTSID));


    const deleteReComment = await cmtService.deleteReComment(userId, commentsId);
    
    return res.send({ isSuccess:true, code:1000, message:"댓글 삭제 완료!", 
    "result": { 
        "postId" : postId , 
        "userId" : userId, 
        "commentId" : commentId }
    });

};


/**
 * API No. 39. 
 * API Name : 대댓글 삭제 API
 * [POST] /cmt/delete/category/:category/post/:postId/comment/:commentId/comments/:commentsId
 * 
 */
 exports.deleteReComment = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { category, postId, commentId, commentsId } = req.params;

    // 유저 체크
    const statusCheck1 = await userProvider.checkUserStatus(userId);
    if(statusCheck1.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 공백 체크
    var re = /^ss*$/;
   
    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));

    if (!Number(category) || !Number(postId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    // 해당하는 카테고리에 postId 가 유효한지
    const existPost = await comProvider.selectPostByPostId(category, postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.VALID_CATEGORY_POSTID));

    // commentId
    if(!commentId || re.test(commentId))
        return res.send(errResponse(baseResponse.INPUT_COMMENTID));

    // 해당하는 post에 commentId 가 유효한지
    const existComment = await cmtProvider.selectCommentInPost(postId, commentId);
    if(existComment.length < 1)
        return res.send(errResponse(baseResponse.VALID_POST_COMMENTID));

    // commentsId
    if(!commentsId || re.test(commentsId))
        return res.send(errResponse(baseResponse.INPUT_COMMENTSID));

    // 해당하는 commentId 에 commentsId가 유효한지
    const existComments = await cmtProvider.selectCommentsInComment(commentId, commentsId);
    if(existComments.length < 1)
        return res.send(errResponse(baseResponse.VALID_COMMENTID_COMMENTSID));

    const deleteReComment = await cmtService.deleteReComment(userId, commentsId);
    
    return res.send({ isSuccess:true, code:1000, message:"대댓글 삭제 완료!", 
    "result": { 
        "postId" : postId , 
        "userId" : userId, 
        "commentId" : commentId,
        "commentsId" : commentsId }
    });

};


/**
 * API No. 40. 
 * API Name : 댓글 편집 API
 * [PATCH] /cmt/category/:category/post/:postId/comment/:commentId
 * 
 */
 exports.patchComment = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { category, postId, commentId } = req.params;
    const { content } = req.body;

    // 유저 체크
    const statusCheck1 = await userProvider.checkUserStatus(userId);
    if(statusCheck1.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 공백 체크
    var re = /^ss*$/;
   
    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));

    if (!Number(category) || !Number(postId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    // 해당하는 카테고리에 postId 가 유효한지
    const existPost = await comProvider.selectPostByPostId(category, postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.VALID_CATEGORY_POSTID));

    // commentId
    if(!commentId || re.test(commentId))
        return res.send(errResponse(baseResponse.INPUT_COMMENTID));

    // 해당하는 post에 commentId 가 유효한지
    const existComment = await cmtProvider.selectCommentInPost(postId, commentId);
    if(existComment.length < 1)
        return res.send(errResponse(baseResponse.VALID_POST_COMMENTID));

    // content
    if(!content || re.test(content))
        return res.send(errResponse(baseResponse.INPUT_COMMENT_CONTENT));

    if(!String(content))
        return res.send(errResponse(baseResponse.INPUT_STRING));

    if(content.length > 500)
            return res.send(errResponse(baseResponse.CONTENT_LENGTH));

    const patchComment = await cmtService.patchComment(userId, commentId, content);
    
    return res.send({ isSuccess:true, code:1000, message:"댓글 편집 완료!", 
    "result": { 
        "postId" : postId , 
        "userId" : userId, 
        "commentId" : commentId,
        "content" : content
     }
    });

};

/**
 * API No. 41. 
 * API Name : 대댓글 편집 API
 * [POST] /cmt/category/:category/post/:postId/comment/:commentId/comments/:commentsId
 * 
 */
 exports.patchReComment = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { category, postId, commentId, commentsId } = req.params;
    const { content } = req.body;

    // 유저 체크
    const statusCheck1 = await userProvider.checkUserStatus(userId);
    if(statusCheck1.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 공백 체크
    var re = /^ss*$/;
   
    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));

    if (!Number(category) || !Number(postId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    // 해당하는 카테고리에 postId 가 유효한지
    const existPost = await comProvider.selectPostByPostId(category, postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.VALID_CATEGORY_POSTID));

    // commentId
    if(!commentId || re.test(commentId))
        return res.send(errResponse(baseResponse.INPUT_COMMENTID));

    // 해당하는 post에 commentId 가 유효한지
    const existComment = await cmtProvider.selectCommentInPost(postId, commentId);
    if(existComment.length < 1)
        return res.send(errResponse(baseResponse.VALID_POST_COMMENTID));

    // commentsId
    if(!commentsId || re.test(commentsId))
        return res.send(errResponse(baseResponse.INPUT_COMMENTSID));

    // 해당하는 commentId 에 commentsId가 유효한지
    const existComments = await cmtProvider.selectCommentsInComment(commentId, commentsId);
    if(existComments.length < 1)
        return res.send(errResponse(baseResponse.VALID_COMMENTID_COMMENTSID));

    // content
    if(!content || re.test(content))
        return res.send(errResponse(baseResponse.INPUT_COMMENT_RECONTENT));
    
    if(!String(content))
        return res.send(errResponse(baseResponse.INPUT_STRING));

    if(content.length > 500)
        return res.send(errResponse(baseResponse.CONTENT_LENGTH));

    const patchReComment = await cmtService.patchReComment(userId, content, commentsId);
    
    return res.send({ isSuccess:true, code:1000, message:"대댓글 편집 완료!", 
    "result": { 
        "postId" : postId , 
        "userId" : userId, 
        "commentId" : commentId,
        "commentsId" : commentsId,
        "content" : content }
    });

};