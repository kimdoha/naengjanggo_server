// 이미 있는 친구 관계인지 조회
async function selectFriendByFriendId(connection, userId, friendId) {
    const selectListQuery = `
    SELECT EXISTS
    (SELECT * FROM Friend
    WHERE userId = ? AND otherId = ?)
    AS exist;
    `;
    const [selectListRows] = await connection.query( selectListQuery, [ userId, friendId] );
    return selectListRows;
  }

async function selectStatus(connection, userId, friendId) {
    const selectListQuery = `
    SELECT status FROM Friend
    WHERE userId = ? AND otherId = ?;
    `;
    const [selectListRows] = await connection.query( selectListQuery, [ userId, friendId ] );
    return selectListRows;
  }

// 친구추가
async function addFriend(connection,  userId, friendId) {
    const insertListQuery = `
    INSERT INTO Friend(userId, otherId) 
    VALUES(?, ?);
    `;
    const [insertListRows] = await connection.query(insertListQuery, [ userId, friendId ]);
    return insertListRows;
  }

async function patchFriend1(connection, userId, friendId) {
  const patchListQuery = `
    UPDATE Friend
    SET status = 1
    WHERE userId = ? AND otherId = ?;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ userId, friendId ]);
  return patchListRows;
}

// 친구 삭제
async function patchFriend0(connection, userId, friendId) {
    const patchListQuery = `
    UPDATE Friend
    SET status = 0
    WHERE userId = ? AND otherId = ?;
    `;
    const [patchListRows] = await connection.query(patchListQuery, [ userId, friendId ]);
    return patchListRows;
  }
// 친구 목록 조회
async function retrieveFriendList(connection, userId) {
  const selectProductQuery = `
    SELECT U.userId, nickName, profileImg
    FROM Friend F
    INNER JOIN User U ON U.userId = F.otherId
    WHERE F.userId = ? AND F.status = 1
    AND U.status = 1
    ORDER BY F.createAt;
  `;
  const [selectListRows] = await connection.query(selectProductQuery , userId);
  return selectListRows;
}
// 유저 정보 리스트
// day이후 날짜의 상품들 
async function selectPushAlarmUser(connection, day) {
    const selectListQuery = `
    SELECT DISTINCT F.userId, registrationToken
    FROM Product P
    INNER JOIN Fridge F on P.frigeId = F.frigeId
    INNER JOIN User U on F.userId = U.userId
    INNER JOIN Alarm A on F.userId = A.userId
    WHERE P.status = 1
    AND date = (SELECT DATE_FORMAT(DATE_ADD(CURRENT_DATE() , INTERVAL ? Day), "%Y-%m-%d"))
    AND A.status = 1
    AND A.dateAlarm = 1
    AND A.dateDiff = ?;
    `;
    const [selectListRows] = await connection.query(selectListQuery, [ day, day ]);
    return selectListRows;
  }


// 유저별 상품정보 리스트
async function selectMessage(connection, user, day) {
  const selectListQuery = `
  SELECT
  IF( count(*) > 1,
   CONCAT( nickName, '님 ',
   (SELECT productName
   FROM Product P
   INNER JOIN Fridge F on P.frigeId = F.frigeId
   INNER JOIN User U on F.userId = U.userId
   WHERE F.userId = ${user}
   AND P.status = 1
   AND P.date = (SELECT DATE_FORMAT(DATE_ADD(CURRENT_DATE() , INTERVAL ? Day), "%Y-%m-%d"))
   ORDER BY productName
   LIMIT 1) , ' 외 ', count(*),'개 ', ? , '일 남았어요 얼른 소진해야겠어요 :D️')
 ,
 CONCAT( nickName, '님 ',
   productName, ' ' , ? , '일 남았어요 얼른 소진해야겠어요 :D'))
     AS message
FROM Product P
INNER JOIN Fridge F on P.frigeId = F.frigeId
INNER JOIN User U ON U.userId = F.userId
WHERE F.userId = ${user} AND F.status = 1 AND
 P.status = 1 AND
 P.date = (SELECT DATE_FORMAT(DATE_ADD(CURRENT_DATE() , INTERVAL ? Day), "%Y-%m-%d"));

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ day, day ,day ,day ]);
  return selectListRows;
  }


async function selectProductByToday(connection, userId) {
    const selectProductQuery = `
    SELECT  ( @a := @a+1 ) AS idx, content, DATE_FORMAT(createAt, '%Y-%m-%d') AS date
    FROM ShoppingList
    WHERE DATE(createAt) = CURRENT_DATE() AND status = 1 AND userId = ?
    LIMIT 100;
    `;
    const [selectListRows] = await connection.query(selectProductQuery , userId);
    return selectListRows;
  }

 
  module.exports = {
    selectFriendByFriendId,
    selectStatus,
    addFriend,
    patchFriend1,
    patchFriend0,
    retrieveFriendList,    
    selectPushAlarmUser,
    selectMessage,
  };
  
  