module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 0. 자체 회원가입 API
  app.post("/sign-up", user.signUp);

  // 0. 자체 로그인 API
  app.post("/sign-in", user.signIn);

  // 소셜 로그인 API
  app.post("/social-login", user.socialLogin);

  // 1. 애플로그인 API
  app.route("/apple-login").post(user.appleLogin);

  // 2. 카카오로그인 API
  app.route("/kakao-login").post(user.kakaoLogin);

  // 3. 자동로그인 API
  app.post("/auto-login", jwtMiddleware, user.autoLogin);

  // 4. 네이버로그인 API
  app.route("/naver-login").post(user.naverLogin);


  // 10. [수정 및 삭제 할 때] 냉장고 조회 API
  app.get("/users/fridge", jwtMiddleware, user.getFridgeInfo);

  // 11. 닉네임 / 이미지 수정 API
  app.patch("/users/setinfo", jwtMiddleware, user.setUserInfo);

  // 12. 냉장고 타입 추가 API
  app.post("/users/fridge-type/:type", jwtMiddleware, user.setFridge);

  // 13. 닉네임 / 이미지 조회 API
  app.get("/users/nickname", jwtMiddleware, user.searchUser);
};
