// 이메일 중복 체크
async function emailCheck(connection, email) {
  const selectUserNameQuery = `
    SELECT *
    FROM User
    WHERE email = ? AND status != -1;
                `;
  const [emailRows] = await connection.query(selectUserNameQuery, email);
  return emailRows;
}

// 자체 회원가입
async function insertAppUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
  INSERT INTO User( email, idType, password , registrationToken)
  VALUES (?, 5 ,?, ?); 
    `;
  const insertUserInfoRow = await connection.query(insertUserInfoQuery, insertUserInfoParams);
  return insertUserInfoRow;
}
// 자체 로그인
// 비밀번호 비교
async function selectUserPassword(connection, Email, hashedPassword) {
  const selectUserPasswordQuery = `
    SELECT email, password
    FROM User
    WHERE email LIKE concat ('%', ?, '%') 
    AND password LIKE concat ('%', ?, '%');
        `;
  const [selectListRow] = await connection.query( selectUserPasswordQuery,[ Email, hashedPassword ]);

  return selectListRow;
}

// 닉네임으로 회원 조회
async function selectUserNickname(connection, nickname) {
  const selectUserNameQuery = `
    SELECT nickName, profileImg 
    FROM User 
    WHERE nickName = ? AND status != -1;
                `;
  const [nameRows] = await connection.query(selectUserNameQuery, nickname);
  return nameRows;
}

// 유저 닉네임 및 프로필이미지 조회
async function selectUser(connection, userId) {
  const selectUserQuery = `
    SELECT nickName, profileImg
    FROM User
    WHERE userId = ? AND status != -1;
        `;
  const [userRow] = await connection.query(selectUserQuery, userId);
  return userRow;
}

async function selectUserByNickname(connection, search) {
  const selectUserQuery = `
  SELECT userId, nickName, profileImg
  FROM User
  WHERE nickName = ? AND status = 1;
        `;
  const [userRow] = await connection.query(selectUserQuery, search);
  return userRow;
}

// kakaoId 회원 조회
async function selectUserId(connection, kakaoId) {
  const selectUserIdQuery = `
        SELECT userId, nickname 
        FROM User WHERE kakaoId = ?;
        `;
  const [userRow] = await connection.query(selectUserIdQuery, kakaoId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
  INSERT INTO User( nickName, email, profileImg, idType, kakaoId, registrationToken) 
  VALUES (?, ?, ?, 1, ? ,?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 탈퇴 여부 조회
async function statusCheck(connection, userId) {
  const selectStatusQuery = `
  SELECT userId, status 
  FROM User 
  WHERE userId = ? AND status = 0 OR 1;
        `;
  const [userRow] = await connection.query(selectStatusQuery, userId);
  return userRow;
}
// 네이버 중복 조회
async function selectUserNaverId(connection, naverId) {
  const selectUserIdQuery = `
        SELECT userId, nickname 
        FROM User 
        WHERE naverId = ?;
        `;
  const [userRow] = await connection.query(selectUserIdQuery, naverId);
  return userRow;
}

// 네이버 유저생성
async function insertNaverUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
  INSERT INTO User( nickName, email, profileImg, idType, naverId, registrationToken) 
  VALUES (?, ?, ?, 2, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}
// 냉장고 설정 **********************
async function selectFridgeCount(connection, userId) {
  const selectFridgeQuery = `
  SELECT userId, count, fridgeType
  FROM Fridge
  WHERE userId = ? AND status = 1
  ORDER BY createAt;
    `;
  const [selectUserInfoRow] = await connection.query(selectFridgeQuery, userId);
  return selectUserInfoRow;
}
async function insertFridgeType(connection, userId, count, type) {
  const insertFridgeQuery = `
  INSERT INTO Fridge(userId, count, fridgeType) 
  VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(insertFridgeQuery, [userId, count, type]);
  return insertUserInfoRow;
}

// 준비상태의 유저 체크 
async function selectNoActivate(connection, userId) {
  const updateStatusQuery = `
  SELECT EXISTS (SELECT (nickName IS NOT NULL) 
  FROM User 
  WHERE userId = ? AND status = 0) as exist;
  `;
  const updateUserInfoRow = await connection.query(updateStatusQuery, userId);
  return updateUserInfoRow;
}

// status 활성화 
async function setStatusActivate(connection, userId) {
  const updateStatusQuery = `
  UPDATE User 
  SET status = 1 
  WHERE userId = ?;
    `;
  const updateStatusRow = await connection.query(updateStatusQuery, userId );
  return updateStatusRow;
}

// 프로필이미지 및 닉네임 수정
async function setUserInfo(connection, userId, Name, Image) {
  const updateStatusQuery = `
  UPDATE User 
  SET nickName = ?, profileImg = ? 
  WHERE userId = ? 
  AND status != -1;
    `;
  const updateStatusRow = await connection.query(updateStatusQuery, [Name, Image, userId ]);
  return updateStatusRow;
}

// 냉장고 타입 수정 *******
async function existFridgeCount(connection,userId, count) {
  const selectFridgeQuery = `
    SELECT EXISTS(SELECT *
    FROM Fridge
    WHERE userId = ? AND count = ? AND status = 1) AS exist;
    `;
  const [selectUserInfoRow] = await connection.query(selectFridgeQuery, [userId, count]);
  return selectUserInfoRow;
}

async function patchFridgeType(connection, userId, count, type) {
  const patchFridgeQuery = `
  UPDATE Fridge 
  SET fridgeType = ? 
  WHERE userId = ? AND count = ? AND status = 1;
    `;
  const insertUserInfoRow = await connection.query(patchFridgeQuery, [type, userId, count]);
  return insertUserInfoRow;
}

// 활성화 된 유저 체크
async function checkUserStatus(connection, userId) {
  const selectUserQuery = `
  SELECT *
  FROM User
  WHERE userId = ? AND status = 1;
    `;
  const selectUserInfoRow = await connection.query(selectUserQuery , userId);
  return selectUserInfoRow;
}
// 신고하기
async function declarationCheck(connection, userId) {
  const selectUserQuery = `
  SELECT DISTINCT *
  FROM Notice N
  INNER JOIN User U on N.userId = U.userId
  WHERE N.userId = ? AND U.status = 0 AND
         NOW() BETWEEN N.createAt AND DATE_ADD(N.createAt ,INTERVAL 7 DAY )
  ORDER BY N.createAt DESC
  LIMIT 1;
    `;
  const selectUserInfoRow = await connection.query(selectUserQuery , userId);
  return selectUserInfoRow;
}
// 7일 이후 유저인지 체크
async function declarationUserAfter7days(connection, userId) {
  const selectUserQuery = `
  SELECT DISTINCT *
  FROM Notice N
  INNER JOIN User U on N.userId = U.userId
  WHERE N.userId = ? AND U.status = 0 AND
        NOW() > DATE_ADD(N.createAt ,INTERVAL 7 DAY )
  ORDER BY N.createAt DESC
  LIMIT 1;
    `;
  const selectUserInfoRow = await connection.query(selectUserQuery , userId);
  return selectUserInfoRow[0];
}

async function updateStatus(connection, userId) {
  const updateQuery = `
  UPDATE User
  SET status = 1
  WHERE userId = ? AND status = 0;
    `;
  const updateUserInfoRow = await connection.query(updateQuery, userId);
  return updateUserInfoRow;
}
// 애플로그인
async function socialIdCheck(connection, appleId) {
  const socialIdCheckQuery = `
    SELECT userId
    FROM User
    WHERE status = 1
    and appleId = ? and idType = 3;
          `;
  const [socialIdCheckRows] = await connection.query(socialIdCheckQuery, appleId );
  return socialIdCheckRows;
}
async function insertAppleUser(connection, appleId, email , registration_token) {
  const insertUserInfoQuery = `
  INSERT INTO User(email, idType, appleId, registrationToken) 
  VALUES (?, 3, ?, ? );
    `;
  const insertUserInfoRow = await connection.query(insertUserInfoQuery, [ email, appleId , registration_token] );

  return insertUserInfoRow;
}

// 내가 userId의 친구인지 확인
async function checkFriendStatus(connection, myId, userId) {
  const selectUserQuery = `
    SELECT EXISTS(SELECT *                          
    FROM Friend F                                   
    INNER JOIN  User U ON U.userId = F.otherId      
    WHERE F.userId = ? ##myId                       
      AND F.otherId = ? ##userId                    
      AND F.status = 1 AND U.status = 1) AS exist;
    `;
  const selectUserInfoRow = await connection.query(selectUserQuery ,[ myId, userId ]);
  return selectUserInfoRow;
}

// 알람 추가
async function insertAlarm(connection, userId ) {
  const insertUserInfoQuery = `
  INSERT INTO Alarm(userId) VALUES (?);
    `;
  const insertUserInfoRow = await connection.query(insertUserInfoQuery,  userId );
  return insertUserInfoRow;
}

// 등록 토큰 변경되었는지 확인
async function differentToken(connection, userId, registration_token ) {
  const selectListQuery = `
  SELECT *
  FROM User
  WHERE userId = ? AND status = 1
  AND registrationToken = ?;
    `;
  const [selectListRow] = await connection.query(selectListQuery, [ userId, registration_token ] );
  return selectListRow;
}

// 등록 토큰 업데이트
async function updateToken(connection, userId, registration_token) {
  const updateQuery = `
    UPDATE User
    SET registrationToken = ?
    WHERE userId = ? AND status = 1;
    `;
  const [updateUserInfoRow] = await connection.query(updateQuery, [ registration_token, userId ]);
  return updateUserInfoRow;
}

async function checkFriendStatus2(connection, myId) {
  const selectListQuery = `
    SELECT *
    FROM Friend
    WHERE otherId = ?
    AND status = 1;
          `;
  const [selectListRows] = await connection.query(selectListQuery, myId );
  return selectListRows;
}

module.exports = {
  emailCheck,
  insertAppUserInfo,
  selectUserPassword,
  selectUserNickname,
  selectUser,
  selectUserByNickname,
  selectUserId,
  insertUserInfo,
  statusCheck,
  selectUserNaverId,
  insertNaverUserInfo,
  selectFridgeCount,
  insertFridgeType,
  selectNoActivate,
  setStatusActivate,
  setUserInfo,
  existFridgeCount,
  patchFridgeType,
  checkUserStatus,
  declarationCheck,
  declarationUserAfter7days,
  updateStatus,
  socialIdCheck,
  insertAppleUser,
  checkFriendStatus,
  insertAlarm,
  differentToken,
  updateToken,
  checkFriendStatus2,

};
