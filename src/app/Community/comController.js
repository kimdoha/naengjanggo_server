//const request = require('request');
const { pool } = require("../../../config/database");

const jwtMiddleware = require("../../../config/jwtMiddleware");
const comProvider = require("./comProvider");
const comService = require("./comService");
const comDao = require("./comDao");
const userProvider = require("../User/userProvider");

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const { connect } = require("http2");

const regexEmail = require("regex-email");
const {emit, addListener} = require("nodemon");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");



/**
 * API No. 22.
 * API Name : 글 작성 API
 * [POST] /com/category/:category
 * 
 */

exports.insertPost = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const category = req.params.category;
    
    var { 
        title,
        content1, postImgUrl1 , 
        content2, postImgUrl2 ,
        content3, postImgUrl3 ,
        content4, postImgUrl4 , 
        content5, postImgUrl5 ,
        content6, postImgUrl6 ,
        content7, postImgUrl7 , 
        content8, postImgUrl8 ,
        content9, postImgUrl9 ,
        content10, postImgUrl10

    } = req.body;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
  
    // 공백 체크
    var re = /^ss*$/;
    

    // 빈 값 체크
    if(!title || re.test(title))
        return res.send(errResponse(baseResponse.NO_POST_TITLE));
    
    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));


    if (!String(title))
        return res.send(errResponse(baseResponse.INPUT_STRING));
    

    if (!Number(category))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    
    // 길이 체크
    if (title.length > 100){
        return res.send(errResponse(baseResponse.EXCEED_TITLE_LENGTH));
    }

    if(!content1)
        return res.send(errResponse(baseResponse.NEED_POST_CONTENT));

    if(!postImgUrl1)
        return res.send(errResponse(baseResponse.NEED_POST_IMGURL));
    
    var reimg = /^([\S]+((i?).(jpg|png|jpeg|bmp)))/;

    if(content1.length > 500)
        return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
    
    if(!reimg.test(postImgUrl1))
        return res.send(errResponse(baseResponse.WORSE_IMG_URL));
    
    // 관리자만 글을 쓸 수 있암
    // if(category == 1){
    //     const managerCheck = await comProvider.checkUserManager(userId);
    //     if(managerCheck[0].exist != 1)
    //       return res.send(errResponse(baseResponse.NO_ACCESS_POST));
    // }
    
    const insertPost = await comService.insertPost(userId, title, category, postImgUrl1);
    var postId = await comService.insertPost1(userId, title, category, content1, postImgUrl1);
 
    if(content2 && postImgUrl2){

        if(!content2) {
            content2 = null;
            if(!reimg.test(postImgUrl2))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl2) {
            postImgUrl2 = null;
            if(content2.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl2))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content2.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }

        const response = await comService.insertPost2(userId, postId, content2, postImgUrl2);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }

    if(content3 && postImgUrl3){
        
        if(!content3) {
            content3 = null;
            if(!reimg.test(postImgUrl3))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }

        else if(!postImgUrl3) {
            postImgUrl3 = null;
            if(content3.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl3))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content3.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }

        const response = await comService.insertPost3(userId, postId, content3, postImgUrl3);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    if(content4 && postImgUrl4){
        if(!content4) {
            content4 = null;
            if(!reimg.test(postImgUrl4))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl4) {
            postImgUrl4 = null;
            if(content4.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl4))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content4.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }
        const response = await comService.insertPost4(userId, postId, content4, postImgUrl4);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    if(content5 && postImgUrl5){
        if(!content5) {
            content5 = null;
            if(!reimg.test(postImgUrl5))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl5) {
            postImgUrl5 = null;
            if(content5.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl5))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content5.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }

        const response = await comService.insertPost5(userId, postId, content5, postImgUrl5);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    if(content6 && postImgUrl6){
        if(!content6) {
            content6 = null;
            if(!reimg.test(postImgUrl6))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl6) {
            postImgUrl6 = null;
            if(content6.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl6))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content6.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }

        const response = await comService.insertPost6(userId, postId, content6, postImgUrl6);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }

    if(content7 && postImgUrl7){
        if(!content7) {
            content7 = null;
            if(!reimg.test(postImgUrl7))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl7) {
            postImgUrl7 = null;
            if(content7.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl7))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content7.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }
        const response = await comService.insertPost7(userId, postId, content7, postImgUrl7);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    if(content8 && postImgUrl8){
        if(!content8) {
            content8 = null;
            if(!reimg.test(postImgUrl8))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl8) {
            postImgUrl8 = null;
            if(content8.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl8))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content8.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }
        const response = await comService.insertPost8(userId, postId, content8, postImgUrl8);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    if(content9 && postImgUrl9){

        if(!content9) {
            content9 = null;
            if(!reimg.test(postImgUrl9))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl9) {
            postImgUrl9 = null;
            if(content9.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl9))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content9.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }

        const response = await comService.insertPost9(userId, postId, content9, postImgUrl9);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    if(content10 || postImgUrl10){
        if(!content10) {
            content10 = null;
            if(!reimg.test(postImgUrl10))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl10) {
            postImgUrl10 = null;
            if(content10.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl10))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));

            if(content10.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }

        const response = await comService.insertPost10(userId, postId, content10, postImgUrl10);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    
    if(category == 1)
        return res.send({ isSuccess:true, code:1000, message:"[식재료 관리법] 글 작성 완료!"});
    
    else if(category == 2)
        return res.send({ isSuccess:true, code:1000, message:"[꿀팁 공유] 글 작성 완료!"});
};


/**
 * API No. 23. 
 * API Name : [식재료 관리법 | 꿀팁공유 ] 전체 화면 조회 API
 * [GET] /com/view/category/:category
 * 
 */

 exports.TipShare = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const category = req.params.category;
    const size = 120;
    let { type, page } = req.query;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));


    // 공백 체크
    var re = /^ss*$/;

    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));

    if (!Number(category))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    //default 설정
    if(!type) type = '최신순';

    let filterArr = ['최신순','조회순','과거순','좋아요순'];
    if(filterArr.includes(type) != true){
        return res.send(response(baseResponse.INPUT_FILTER_WRONG));
    }

    if(!page)
        return res.send(response(baseResponse.NO_EMPTY_PAGE));

    if(page == 0)
        return res.send(response(baseResponse.INPUT_PAGE_RANGE));

    page = size * (page-1);


    // 필터별 커뮤니티
    const communityInfo = await comProvider.selectPTipShare(userId, category, type, page, size);
    if(communityInfo.length < 1){
        return res.send(response(baseResponse.SEARCH_RESULT_EMPTY));
    }

    if(category == 1)
        return res.send({ isSuccess:true, code:1000, message:"[식재료 관리법] 전체화면 조회 완료!", "result": { communityInfo }});
    else 
        return res.send({ isSuccess:true, code:1000, message:"[꿀팁공유] 전체화면 조회 완료!", "result": { communityInfo }});
};


/**
 * API No. 24. 
 * API Name : 글 세부 조회 API
 * [GET] /com/view/category/:category/post/:postId
 * 
 */

 exports.PostDetail = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const{ category , postId } = req.params;
    const size = 120;
    

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

    // postId
    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    // 해당하는 카테고리에 postId 가 유효한지
    const existPost = await comProvider.selectPostByPostId(category, postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.VALID_CATEGORY_POSTID));


    // 조회수 증가
    const watch = await comService.addWatchCount(userId, postId);

    const postInfo = await comProvider.selectPostDetail(category, userId, postId);
    if(postInfo.length < 1)
        return res.send(response(baseResponse.SEARCH_RESULT_EMPTY));
    

    if(category == 1)
        return res.send({ isSuccess:true, code:1000, message:"[식재료 관리법] 글 세부 조회 완료!", "result": { postInfo  }});
    else 
        return res.send({ isSuccess:true, code:1000, message:"[꿀팁공유] 글 세부 조회 완료!", "result": { postInfo  }});
};

/**
 * API No. 25. 
 * API Name : 찜 설정 및 해제 API
 * [POST] /com/bookmark/category/:category/post/:postId
 * 
 */

 exports.postJjim = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const category = req.params.category;
    const postId = req.params.postId;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    

    // 공백 체크
    var re = /^ss*$/;

    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));

    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    if (!Number(category) || !Number(postId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    // 해당하는 카테고리에 postId 가 유효한지
    const existPost = await comProvider.selectPostByPostId(category, postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.VALID_CATEGORY_POSTID));

    var jjim = await comProvider.selectJjim(userId, postId);
    if(jjim[0].exist == 0){
        const addJjim = await comService.addJjim(userId, postId);
        return res.send({ isSuccess:true, code:1000, message:"북마크 설정 성공!", "result": { "postId" : Number(postId) }});
    } else {
        var [check] = await comProvider.selectJjimStatus(userId, postId);
        if(check.status == 1) {
            const updateDelete = await comService.deleteJjim(userId, postId);
            return res.send({ isSuccess:true, code:1000, message:"북마크 해제 성공!", "result": { "postId" : Number(postId) }});
        } else {
            const updateAdd = await comService.updateJjim(userId, postId);
            return res.send({ isSuccess:true, code:1000, message:"북마크 설정 성공!", "result": { "postId" : Number(postId) }});
        }
    }
};


/**
 * API No. 27. 
 * API Name : 찜 - 커뮤니티 글 조회 API
 * [GET] /jjim/post
 * 
 */
 exports.JjimPost = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const size = 120;
    let { page } = req.query;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
 
    if(!page)
        return res.send(response(baseResponse.NO_EMPTY_PAGE));

    if(page == 0)
        return res.send(response(baseResponse.INPUT_PAGE_RANGE));
 
    page = size * (page-1);
  
    const postInfo = await comProvider.selectJjimPost(userId, page, size);
    if(postInfo.length < 1)
        return res.send(response(baseResponse.JJIM_RESULT_EMPTY));
      
    return res.send({ isSuccess:true, code:1000, message:"찜-커뮤니티 조회 완료!", "result" : postInfo });

};

/**
 * API No. 26. 
 * API Name : 글 수정 API
 * [PATCH] /com/category/:category/post/:postId
 * 
 */
exports.PatchPost = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { category , postId } = req.params;

    var { 
        title,
        content1, postImgUrl1 , 
        content2, postImgUrl2 ,
        content3, postImgUrl3 ,
        content4, postImgUrl4 , 
        content5, postImgUrl5 ,
        content6, postImgUrl6 ,
        content7, postImgUrl7 , 
        content8, postImgUrl8 ,
        content9, postImgUrl9 ,
        content10, postImgUrl10

    } = req.body;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
  
    // 공백 체크
    var re = /^ss*$/;

    // 빈 값 체크
    if(!title || re.test(title))
        return res.send(errResponse(baseResponse.NO_POST_TITLE));
    
    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));


    if (!String(title))
        return res.send(errResponse(baseResponse.INPUT_STRING));
    

    if (!Number(category) || !Number(postId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    // postId 체크
    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    // 해당하는 카테고리에 postId 가 유효한지
    const existPost = await comProvider.selectPostByPostId(category, postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.VALID_CATEGORY_POSTID));


    // 길이 체크
    if (title.length > 100){
        return res.send(errResponse(baseResponse.EXCEED_TITLE_LENGTH));
    }

    if(!content1)
        return res.send(errResponse(baseResponse.NEED_POST_CONTENT));

    if(!postImgUrl1)
        return res.send(errResponse(baseResponse.NEED_POST_IMGURL));
    
    var reimg = /^([\S]+((i?).(jpg|png|jpeg|bmp)))/;

    if(content1.length > 500)
        return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
    
    if(!reimg.test(postImgUrl1))
        return res.send(errResponse(baseResponse.WORSE_IMG_URL));
    
    // 관리자만 글을 쓸 수 있암
    if(category == 1){
        const managerCheck = await comProvider.checkUserManager(userId);
        if(managerCheck[0].exist != 1)
          return res.send(errResponse(baseResponse.NO_ACCESS_POST));

    }
    
    const response = await comService.updatePost1(userId, postId, title, category, content1, postImgUrl1);
    if(response == baseResponse.DB_ERROR){
        return res.send(errResponse(baseResponse.DB_ERROR));
    }

    if(content2 && postImgUrl2){

        if(!content2) {
            content2 = null;
            if(!reimg.test(postImgUrl2))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl2) {
            postImgUrl2 = null;
            if(content2.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl2))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content2.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }

        const response = await comService.insertPost2(userId, postId, content2, postImgUrl2);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }

    if(content3 && postImgUrl3){
        
        if(!content3) {
            content3 = null;
            if(!reimg.test(postImgUrl3))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }

        else if(!postImgUrl3) {
            postImgUrl3 = null;
            if(content3.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl3))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content3.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }

        const response = await comService.insertPost3(userId, postId, content3, postImgUrl3);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    if(content4 && postImgUrl4){
        if(!content4) {
            content4 = null;
            if(!reimg.test(postImgUrl4))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl4) {
            postImgUrl4 = null;
            if(content4.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl4))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content4.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }
        const response = await comService.insertPost4(userId, postId, content4, postImgUrl4);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    if(content5 && postImgUrl5){
        if(!content5) {
            content5 = null;
            if(!reimg.test(postImgUrl5))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl5) {
            postImgUrl5 = null;
            if(content5.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl5))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content5.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }

        const response = await comService.insertPost5(userId, postId, content5, postImgUrl5);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    if(content6 && postImgUrl6){
        if(!content6) {
            content6 = null;
            if(!reimg.test(postImgUrl6))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl6) {
            postImgUrl6 = null;
            if(content6.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl6))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content6.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }

        const response = await comService.insertPost6(userId, postId, content6, postImgUrl6);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }

    if(content7 && postImgUrl7){
        if(!content7) {
            content7 = null;
            if(!reimg.test(postImgUrl7))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl7) {
            postImgUrl7 = null;
            if(content7.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl7))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content7.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }
        const response = await comService.insertPost7(userId, postId, content7, postImgUrl7);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    if(content8 && postImgUrl8){
        if(!content8) {
            content8 = null;
            if(!reimg.test(postImgUrl8))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl8) {
            postImgUrl8 = null;
            if(content8.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl8))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content8.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }
        const response = await comService.insertPost8(userId, postId, content8, postImgUrl8);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    if(content9 && postImgUrl9){

        if(!content9) {
            content9 = null;
            if(!reimg.test(postImgUrl9))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl9) {
            postImgUrl9 = null;
            if(content9.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl9))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
            
            if(content9.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }

        const response = await comService.insertPost9(userId, postId, content9, postImgUrl9);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    if(content10 || postImgUrl10){
        if(!content10) {
            content10 = null;
            if(!reimg.test(postImgUrl10))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));
        }
        else if(!postImgUrl10) {
            postImgUrl10 = null;
            if(content10.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        } else {
            if(!reimg.test(postImgUrl10))
                return res.send(errResponse(baseResponse.WORSE_IMG_URL));

            if(content10.length > 500)
                return res.send(errResponse(baseResponse.EXCEED_CONTENT_LENGTH));
        }

        const response = await comService.insertPost10(userId, postId, content10, postImgUrl10);
        if(response == baseResponse.DB_ERROR){
            return res.send(errResponse(baseResponse.DB_ERROR));
        }
    }
    
    if(category == 1)
        return res.send({ isSuccess:true, code:1000, message:"[식재료 관리법] 글 수정 완료!"});
    
    else if(category == 2)
        return res.send({ isSuccess:true, code:1000, message:"[꿀팁 공유] 글 수정 완료!"});
};


/**
 * API No. 28. 
 * API Name : 글 삭제 API
 * [PATCH] /com/delete/category/:category/post/:postId
 * 
 */

exports.deletePost = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const category = req.params.category;
    const postId = req.params.postId;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 내가 쓴 글인지
    const deleteUserCheck = await comProvider.checkDeleteUser(userId, postId);
    if(deleteUserCheck.length < 1)
        return res.send(errResponse(baseResponse.INVALID_DELETE_USER));

    // 공백 체크
    var re = /^ss*$/;

    if(!category || re.test(category))
        return res.send(errResponse(baseResponse.NO_POST_CATEGORY));

    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    if (!Number(category) || !Number(postId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(1 > category || category > 2)
        return res.send(errResponse(baseResponse.EXCEED_CATEGORY_RANGE));

    // 해당하는 카테고리에 postId 가 유효한지
    const existPost = await comProvider.selectPostByPostId(category, postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.VALID_CATEGORY_POSTID));

    // 해당 post가 존재하는지
    const existPost2 = await comProvider.existPostByPostId(postId);
    if(existPost2.length < 1)
        return res.send(errResponse(baseResponse.INVALID_POST));

    // 댓글 대댓글 삭제
    var commentList = [];
    const commentId = await comProvider.selectCommentId(postId);

    let cnt = 0;
    let num = commentId.length;

    while(cnt < num){
        commentList.push(commentId[cnt].commentId);
        cnt += 1;
    }
    
    async function deleteComment(commentList){
        for (const commentId of commentList) {
            const reCommentInfo = await comService.deleteReComment(commentId);
            if(reCommentInfo == baseResponse.DB_ERROR)
                return res.send(errResponse(baseResponse.DB_ERROR));

            const commentInfo = await comService.deleteComment(commentId);
            if(commentInfo == baseResponse.DB_ERROR)
                return res.send(errResponse(baseResponse.DB_ERROR));
        };
    }
    await deleteComment(commentList);

    const deletePost = await comService.deletePost(postId);
    if(deletePost == baseResponse.DB_ERROR)
                return res.send(errResponse(baseResponse.DB_ERROR));

    return res.send({ isSuccess:true, code:1000, message:"글 삭제 완료!"});
};

/**
 * API No. 31. 
 * API Name : 신고 API - 해당 글 삭제 + 해당 유저 일주일 정지
 * [POST] /declaration/post/:postId
 * 
 */

 exports.Declaration = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const postId = req.params.postId;
    const { type } = req.query;
    const { content } = req.body;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    
    // 공백 체크
    var re = /^ss*$/;

    if(!postId || re.test(postId))
        return res.send(errResponse(baseResponse.INPUT_POSTID));

    if (!Number(postId))
        return res.send(errResponse(baseResponse.INPUT_NUMBER));

    // 해당 post가 존재하는지
    const existPost = await comProvider.existPostByPostId(postId);
    if(existPost.length < 1)
        return res.send(errResponse(baseResponse.INVALID_POST));


    // type
    if(!type || re.test(type))
        return res.send(errResponse(baseResponse.TYPE_INPUT_NUMBER));


    var reason = "";
    if(type == 1){
        reason = "불법적인 게시물이에요.";

    } else if(type == 2) {
        reason = "불쾌한 내용이 포함되어 있어요.";

    } else if(type == 3){
        if(!content || re.test(content))
            return res.send(errResponse(baseResponse.INPUT_DECLARE_CONTENT));

        if(!String(content))
            return res.send(errResponse(baseResponse.INPUT_STRING));

        if(content.length > 300)
            return res.send(errResponse(baseResponse.LENGTH_DECLARE_CONTENT));
        reason = content;

    } else {
        return res.send(errResponse(baseResponse.INPUT_FILTER_WRONG));
    }
    
    // 이미 내가 신고했는지
    const existDeclar = await comProvider.existDeclaration(userId, postId);
    if(existDeclar.exist == 1)
        return res.send(errResponse(baseResponse.ALREADY_DECLAR))

    // 신고안했으면 신고하고
    const declaration = await comService.insertDeclaration(userId, postId, reason);

    // 이후 글 삭제 및 유저 7일 정지
    const after = await comService.afterWork(postId);

    return res.send(response({ isSuccess:true, code:1000, message:"해당 글에 대한 신고 완료!"}));
};