module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1000, "message":"JWT 토큰 검증 성공" }, 

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 8~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력해주세요" },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요" },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },
    USER_TOKEN_EMPTY: { "isSuccess": false, "code": 2019, "message": "access token을 입력해주세요" },
    INPUT_IMP_UID : { "isSuccess": false, "code": 2020, "message": "가맹점 식별번호를 입력해주세요" },

    // 냉장고 설정
    INPUT_NUMBER : { "isSuccess": false, "code": 2021, "message": "숫자로 입력해주세요" },
    EXCEED_NUMBER : { "isSuccess": false, "code": 2022, "message": "숫자 입력 범위가 미만이거나 초과했습니다" },

    // 장보기 리스트
    INPUT_STRING : { "isSuccess": false, "code": 2023, "message": "String형식으로 입력해주세요" },
    INPUT_PRODUCT : { "isSuccess": false, "code": 2024, "message": "식재료를 입력해주세요" },
    EXCEED_LENGTH : { "isSuccess": false, "code": 2025, "message": "입력 범위를 초과했습니다" },

    // 닉네임 & 프로필이미지 설정
    PROFILE_IMG: { "isSuccess": false, "code": 2026, "message": "프로필 이미지는 jpg|png|gif|bmp 형식으로 입력해주세요" },
    NO_SPACE : { "isSuccess": false, "code": 2027, "message": "공백을 포함할 수 없습니다" },
    NICKNAME_LIMIT : { "isSuccess": false, "code": 2028, "message": "2~20자 사이의 문자열을 입력해주세요" },

    // 냉장고 수정
    TYPE_INPUT_NUMBER : { "isSuccess": false, "code": 2029, "message": "type을 숫자로 입력해주세요" },
    COUNT_INPUT_NUMBER : { "isSuccess": false, "code": 2030, "message": "count를 숫자로 입력해주세요" },

    // 크롤링
    NO_WASTE_ID : { "isSuccess": false, "code": 2031, "message": "음쓰홈페이지 ID를 입력해주세요" },
    NO_WASTE_PW : { "isSuccess": false, "code": 2032, "message": "음쓰홈페이지 PW를 입력해주세요" },
    NO_WASTE_TAGNUM : { "isSuccess": false, "code": 2033, "message": "음쓰홈페이지 태그번호를 입력해주세요" },
    NO_WASTE_DONG : { "isSuccess": false, "code": 2034, "message": "아파트 동을 입력해주세요" },
    NO_WASTE_HO : { "isSuccess": false, "code": 2035, "message": "아파트 호를 입력해주세요" },
    NO_WASTE_STARTDATE : { "isSuccess": false, "code": 2036, "message": "조회 시작 날짜를 입력해주세요" },
    NO_WASTE_ENDDATE : { "isSuccess": false, "code": 2037, "message": "조회 종료 날짜를 입력해주세요" },

    NO_WASTE_STRING : { "isSuccess": false, "code": 2038, "message": "문자열로 입력해주세요" },

    // 커뮤니티
    NO_POST_TITLE : { "isSuccess": false, "code": 2039, "message": "글 제목은 필수 입력 항목입니다" },
    NO_POST_CATEGORY : { "isSuccess": false, "code": 2040, "message": "카테고리를 입력해주세요" },
    EXCEED_CATEGORY_RANGE : { "isSuccess": false, "code": 2041, "message": "입력 가능한 카테고리 범위를 벗어났습니다" },
    EXCEED_TITLE_LENGTH : { "isSuccess": false, "code": 2042, "message": "제목은 100자 미만으로 입력해주세요" },
    NEED_POST_IMGURL : { "isSuccess": false, "code": 2043, "message": "사진은 필수 입력 항목입니다" },
    NEED_POST_CONTENT : { "isSuccess": false, "code": 2044, "message": "내용은 필수 입력 항목입니다" },
    EXCEED_CONTENT_LENGTH : { "isSuccess": false, "code": 2045, "message": "500자를 초과하였습니다" },

    // 사진
    NO_IMG_FORMAT : { "isSuccess": false, "code": 2046, "message": "지원하는 사진형식이 아닙니다" },
    WORSE_IMG_URL  : { "isSuccess": false, "code": 2047, "message": "이미지URL 형식이 잘못되었습니다" },
    
    // 냉장고 수정 추가
    COUNT_EXCEED_NUMBER : { "isSuccess": false, "code": 2048, "message": "count수는 4개이하입니다" },

    // 친구
    NOT_FRIEND_ACCESS : { "isSuccess": false, "code": 2049, "message": "친구 초대할 수 없는 대상입니다" },
    INPUT_FRIENDID : { "isSuccess": false, "code": 2050, "message": "userId를 입력해주세요" },

    // 커뮤니티 조회
    INPUT_FILTER_WRONG : { "isSuccess": false, "code": 2051, "message": "잘못된 필터입력입니다" },
    NO_EMPTY_PAGE : { "isSuccess": false, "code": 2052, "message": "페이지를 입력해주세요" },
    INPUT_PAGE_RANGE : { "isSuccess": false, "code": 2053, "message": "페이지는 1부터 시작합니다" },
    INPUT_POSTID : { "isSuccess": false, "code": 2054, "message": "postId를 입력해주세요" },

    // 게시글 신고하기
    INPUT_DECLARE_CONTENT : { "isSuccess": false, "code": 2055, "message": "신고 내용을 입력해주세요" },
    LENGTH_DECLARE_CONTENT :  { "isSuccess": false, "code": 2056, "message": "신고 글자 수는 300자 이하로 입력해주세요" },

    // 댓글 내용
    INPUT_COMMENT_CONTENT : { "isSuccess": false, "code": 2057, "message": "댓글 내용을 입력해주세요" },

    // 대댓글 내용
    INPUT_COMMENTID : { "isSuccess": false, "code": 2058, "message": "commentId를 입력해주세요" },
    INPUT_COMMENT_RECONTENT : { "isSuccess": false, "code": 2059, "message": "대댓글 내용을 입력해주세요" },

    // 대댓글 좋아요
    INPUT_COMMENTSID : { "isSuccess": false, "code": 2060, "message": "commentsId를 입력해주세요" },

    CONTENT_LENGTH : { "isSuccess": false, "code": 2061, "message": "내용을 500자 이하로 입력해주세요" },

    // 식재료 업로드
    INPUT_ARRAY : { "isSuccess": false, "code": 2062, "message": "식재료 리스트 배열을 입력해주세요" },
    INPUT_PRODUCT_NAME :  { "isSuccess": false, "code": 2063, "message": "식재료 이름을 입력해주세요" },
    INPUT_PRODUCT_COUNT :  { "isSuccess": false, "code": 2064, "message": "식재료 수량을 1이상으로 입력해주세요" },
    INPUT_LIMIT_DATE : { "isSuccess": false, "code": 2065, "message": "유통기한 날짜를 입력해주세요" },
    INVALID_INPUT_PLACE :  { "isSuccess": false, "code": 2066, "message": "냉장고 칸 입력이 잘못되었습니다" },
    INVALID_EXPIRATION_DATE : { "isSuccess": false, "code": 2067, "message": "유통기한 날짜 형식이 잘못되었습니다" },

    // 장보기 리스트
    INPUT_LIST_SEARCH : { "isSuccess": false, "code": 2068, "message": "장보기 리스트에 추가할 식재료를 입력하세요" },

    // 냉장고 속 식재료 검색
    INPUT_PRODUCT_SEARCH : { "isSuccess": false, "code": 2069, "message": "검색할 식재료를 입력해주세요" },
    NO_SEARCH_RESULT : { "isSuccess": false, "code": 2070, "message": "검색 결과가 없습니다" },

    // RFID 음식물 쓰레기 
    INVALID_TAGNUM : { "isSuccess": false, "code": 2071, "message": "태그번호 형식이 올바르지 않습니다" },

    // 유통기한 알람 만료일 선택
    INPUT_EXPIRY_DATE : { "isSuccess": false, "code": 2072, "message": "유통기한 알람 만료일을 선택해주세요" },
    INVALID_EXPIRY_DATE : { "isSuccess": false, "code": 2073, "message": "유통기한 알람 만료일은 1 ~ 7로 입력해주세요" },

    // FCM 등록 토큰
    INPUT_REGISTRATION_TOKEN : { "isSuccess": false, "code": 2074, "message": "FCM 등록 토큰을 입력해주세요" },
    INPUT_APPLE_CODE :  { "isSuccess": false, "code": 2075, "message": "APPLE 인가 코드를 입력해주세요" },

    // 자체 회원가입 패스워드 
    INVALID_PASSWORD :  { "isSuccess": false, "code": 2076, "message": "비밀번호는 숫자+영문자+특수문자 조합으로 8자리 이상 사용해야 합니다" },
    INPUT_NOT_SPACE :  { "isSuccess": false, "code": 2077, "message": "공백없이 입력해주세요." },
    

    // 음쓰 페이지 달 입력
    INPUT_MONTH :  { "isSuccess": false, "code": 2078, "message": "달을 입력해주세요" },
    MONTH_RANGE : { "isSuccess": false, "code": 2079, "message": "1 ~ 12월로 입력해주세요" },

    // 레시피
    INPUT_RECIPEID : { "isSuccess": false, "code": 2080, "message": "레시피ID를 입력해주세요" },

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다" },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정이거나 없는 유저입니다" },
    FRIEND_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "상대방이 비활성화 된 계정이거나 없는 유저입니다" },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다" },

    KAKAO_LOGIN_FAILURE : { "isSuccess": false, "code": 3007, "message": "카카오 로그인 실패" },
    USER_EXIST_EMPTY : { "isSuccess": false, "code": 3008, "message": "존재하지 않는 userId입니다" },
    NAVER_LOGIN_FAIL : { "isSuccess": false, "code": 3009, "message": "네이버 로그인 실패" },
    
    // 장보기 리스트
    SHOPPINGLIST_NOT_DELETE : { "isSuccess": false, "code": 3010, "message": "삭제되었거나 유효하지 않은 listId입니다" },
    INPUT_LAST_DATE : { "isSuccess": false, "code": 3011, "message": "1개월 미만의 지난 날짜를 입력해주세요" },

    // 냉장고 설정 
    SET_FRIDGE_EXCEED : { "isSuccess": false, "code": 3012, "message": "설정할 수 있는 냉장고 개수를 초과했습니다" },
    NO_EXIST_FRIDGE : { "isSuccess": false, "code": 3013, "message": "해당하는 냉장고가 존재하지 않습니다" },

    NOT_EXIST_FRIDGE : { "isSuccess": false, "code": 3014, "message": "냉장고가 존재하지 않습니다" },

    // 검색어
    NO_RECENT_SEARCH : { "isSuccess": false, "code": 3015, "message": "최근 검색어가 없습니다" },
    
    // 크롤링
    NO_SEARCH_DATA : { "isSuccess": false, "code": 3016, "message": "조회된 데이터가 없습니다" },
    NO_ACCESS_LOGIN : { "isSuccess": false, "code": 3017, "message": "로그인에 실패되었습니다" },
    
    // 커뮤니티
    NO_ACCESS_POST : { "isSuccess": false, "code": 3018, "message": "관리자 외 글을 쓸 수 없습니다" },
    
    // 친구
    EXIST_FRIEND : { "isSuccess": false, "code": 3019, "message": "이미 친구 추가된 유저입니다" },
    NOT_EXIST_FRIEND : { "isSuccess": false, "code": 3020, "message": "상대 유저와 친구 상태가 아닙니다" },
    ALREADY_DELETE :  { "isSuccess": false, "code": 3021, "message": "이미 삭제된 친구입니다" },

    // 커뮤니티 조회 및 북마크 설정
    SEARCH_RESULT_EMPTY : { "isSuccess": false, "code": 3022, "message": "커뮤니티 글이 없습니다" },
    VALID_CATEGORY_POSTID : { "isSuccess": false, "code": 3023, "message": "해당 카테고리의 postId가 유효하지 않습니다" },

    // 찜
    JJIM_RESULT_EMPTY : { "isSuccess": false, "code": 3024, "message": "찜한 커뮤니티 글이 없습니다" },

    // 신고하기
    INVALID_POST : { "isSuccess": false, "code": 3025, "message": "삭제되었거나 유효하지 않은 게시글입니다" },
    ALREADY_DECLAR : { "isSuccess": false, "code": 3026, "message": "이미 신고한 글입니다" },
    DECLAR_USER_IN_7DAYS : { "isSuccess": false, "code": 3027, "message": "유저는 7일간 정지되었습니다" },

    // 대댓글
    VALID_POST_COMMENTID : { "isSuccess": false, "code": 3028, "message": "해당 게시글의 commentId가 유효하지 않습니다" },

    // 댓글 조회
    EMPTY_COMMENT_RESULT : { "isSuccess": false, "code": 3029, "message": "댓글이 없습니다" },
    EMPTY_RECOMMENT_RESULT : { "isSuccess": false, "code": 3030, "message": "대댓글이 없습니다" },

    // 대댓글 좋아요
    VALID_COMMENTID_COMMENTSID : { "isSuccess": false, "code": 3031, "message": "해당 댓글의 commentsId가 유효하지 않습니다" },

    // 애플 로그인
    APPLE_LOGIN_FAILURE : { "isSuccess": false, "code": 3032, "message": "애플 로그인 실패" },

    // 식재료 업로드 = 유통기한 날짜 
    REGISTER_DATE_FAILURE : { "isSuccess": false, "code": 3033, "message": "유통기한 날짜 조회 실패" },
    FRIDGE_PLACE_EMPTY : { "isSuccess": false, "code": 3034, "message": "해당 냉장고 칸에 식재료가 비어있습니다" },

    // 식재료 메세지
    NO_EXIST_MESSAGE : { "isSuccess": false, "code": 3035, "message": "해당 식재료의 메세지가 없습니다" },

    // 친구 접근 권한
    INVALID_ACCESS_FRIEND : { "isSuccess": false, "code": 3036, "message": "해당 유저의 접근 권한이 없습니다" },

    // 식재료 삭제
    NOT_DELETE_PRODUCT : { "isSuccess": false, "code": 3037, "message": "해당 냉장고 칸에 productId가 존재하지 않거나, 이미 삭제된 상품입니다" },

    // 글 삭제
    INVALID_DELETE_USER: { "isSuccess": false, "code": 3038, "message": "작성자만 글 삭제를 할 수 있습니다" },

    // 친구 목록 조회
    NO_EXIST_FRIEND : { "isSuccess": false, "code": 3039, "message": "친구가 없거나 조회되지 않습니다" },

    // 영수증 인식 5번 제한
    ALREADY_RECEIPT_LIMIT :  { "isSuccess": false, "code": 3040, "message": "이번 주의 인식 가능한 횟수를 초과하였습니다(5회)" },

    // 유통기한 알람
    DATE_ALARM_OFF :  { "isSuccess": false, "code": 3041, "message": "알람이 off되어있습니다" },

    // 레시피
    RECIPE_ERROR :  { "isSuccess": false, "code": 3042, "message": "레시피를 불러오지 못했습니다" },

    // 음식물 쓰레기 
    NO_EXIST_WASTE :  { "isSuccess": false, "code": 3043, "message": "음식물 쓰레기 홈페이지 관련 유저 정보가 없습니다" },
    FRIDGE_CHANGE :  { "isSuccess": false, "code": 3044, "message": "냉장고 타입을 기존과 다르게 변경해주세요" },

    // 유통기한 상품
    PRODUCT_DATE_LIMIT :  { "isSuccess": false, "code": 3045, "message": "유통기한 임박한 상품이 없습니다" },

    // 레시피
    INVALID_RECIPEID:  { "isSuccess": false, "code": 3046, "message": "해당 레시피ID가 존재하지 않거나 유효하지 않습니다" },
    NO_SEARCH_RECIPE:  { "isSuccess": false, "code": 3047, "message": "해당 레시피가 삭제되었거나 결과가 조회되지 않습니다" },

    // 냉장고 공유
    NO_SELECTABLE_FRIDGE :  { "isSuccess": false, "code": 3048, "message": "선택할 수 있는 냉장고가 없습니다" },

    // 냉장고 삭제
    NO_DELETE_FRIDGE :  { "isSuccess": false, "code": 3049, "message": "냉장고를 삭제할 수 없습니다" },

    // 영수증인지 확인
    INPUT_RECEIPT : { "isSuccess": false, "code": 3050, "message": "해당 사진은 영수증이 아닙니다" },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
    SCRAPPING_ERROR : { "isSuccess": false, "code": 4002, "message": "웹스크래핑 에러입니다"},
 
}
