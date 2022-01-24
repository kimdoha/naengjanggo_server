  
// 최근 검색어 조회
async function selectSearchList(connection, userId) {
    const selectListQuery = `
    SELECT search, searchId
    FROM MySearch
    WHERE userId = ? AND status = 1
    ORDER BY createAt DESC
    LIMIT 12;
    `;
    const [selectListRows] = await connection.query(selectListQuery, userId);
    return selectListRows;
  }

// 최근 검색어 삭제 
async function deleteSearch(connection, userId) {
    const deleteListQuery = `
    UPDATE MySearch
    SET status = 0
    WHERE status = 1 AND userId = ?
    ORDER BY createAt DESC
    LIMIT 12;
    `;
    const [deleteListRows] = await connection.query(deleteListQuery, userId);
    return deleteListRows;
  }

async function retrieveFridgeCount(connection, userId, count) {
    const selectListQuery = `
      SELECT frigeId, fridgeType
      FROM Fridge
      WHERE userId = ? AND count = ?
      AND status = 1;
    `;
    const [selectListRows] = await connection.query(selectListQuery , [ userId, count ]);
    return selectListRows;
  }

// 유통기한 날짜 설정
async function selectRegisterDate(connection, productDate) {
    const selectListQuery = `
    SELECT DATE_FORMAT(
      DATE_ADD(CURRENT_DATE() , INTERVAL ? Day), "%Y-%m-%d") 
      AS date;
    `;
    const [selectListRows] = await connection.query(selectListQuery , productDate);
    return selectListRows;
  }

// 식재료 업로드
async function insertProduct(connection, userId, fridgeId, productName, place, finalDate, productCount) {
  const insertListQuery = `
    INSERT INTO Product(userId, frigeId, productName, productCount, place, date)
    VALUES(?, ?, ?, ?, ?, ?);
  `;
  const [insertListRows] = await connection.query(insertListQuery , [ userId, fridgeId, productName, productCount, place, finalDate ]);
  return insertListRows;
}

// 유통기한 => 일 수로 변경
async function selectExpirationDate(connection, expirationDate) {
    const selectProductQuery = `
    SELECT TIMESTAMPDIFF(DAY, CURRENT_DATE(), ?) 
    AS diff;
    `;
    const [selectListRows] = await connection.query(selectProductQuery , expirationDate);
    return selectListRows;
  }


// 냉장고 세부화면 조회
async function selectFridgeDetail(connection, userId, fridgeId, place, page, size) {
    const selectDateQuery = `
    SELECT productId, P.productName, productCount,
       (SELECT
       IF(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date) > 0,
           CONCAT('D-', TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))
           ,CONCAT('D+', ABS(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))))
        ) AS date, 
      DATE_FORMAT(createAt, '%Y년 %m월 %d일') AS registerDate
    FROM Product P
    WHERE P.userId = ${userId} AND status = 1
    AND P.frigeId = ? AND place = ?
    ORDER BY P.date
    LIMIT ? , ?;
    `;
    const [selectListRows] = await connection.query(selectDateQuery , [ fridgeId,  place, page, size ]);
    return selectListRows;
  }

// 냉장고 전체 화면
async function selectFridgeHome1(connection, userId, fridgeId, place, n1) {
  const selectDateQuery = `
  SELECT productId, P.productName,
     (SELECT
     IF(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date) > 0,
         CONCAT('D-', TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))
         ,CONCAT('D+', ABS(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))))
      ) AS date
  FROM Product P
  WHERE P.userId = ${userId} AND status = 1
  AND P.frigeId = ? AND place = ?
  ORDER BY P.date
  LIMIT ${n1};
  `;
  const [selectListRows] = await connection.query(selectDateQuery , [ fridgeId,  place ]);
  return selectListRows;
}

async function selectFridgeHome2(connection, userId, fridgeId, place ,n2 ) {
  const selectDateQuery = `
  SELECT productId, P.productName,
     (SELECT
     IF(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date) > 0,
         CONCAT('D-', TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))
         ,CONCAT('D+', ABS(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))))
      ) AS date
  FROM Product P
  WHERE P.userId = ${userId} AND status = 1
  AND P.frigeId = ? AND place = ?
  ORDER BY P.date
  LIMIT ${n2};
  `;
  const [selectListRows] = await connection.query(selectDateQuery , [ fridgeId,  place , n2 ]);
  return selectListRows;
}

async function selectFridgeHome3(connection, userId, fridgeId, place, n3) {
  const selectDateQuery = `
  SELECT productId, P.productName, 
     (SELECT
     IF(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date) > 0,
         CONCAT('D-', TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))
         ,CONCAT('D+', ABS(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))))
      ) AS date
  FROM Product P
  WHERE P.userId = ${userId} AND status = 1
  AND P.frigeId = ? AND place = ?
  ORDER BY P.date
  LIMIT ${n3};
  `;
  const [selectListRows] = await connection.query(selectDateQuery , [ fridgeId,  place ]);
  return selectListRows;
}

async function selectFridgeHome41(connection, userId, fridgeId, place, n41) {
  const selectDateQuery = `
  SELECT productId, P.productName, 
     (SELECT
     IF(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date) > 0,
         CONCAT('D-', TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))
         ,CONCAT('D+', ABS(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))))
      ) AS date
  FROM Product P
  WHERE P.userId = ${userId} AND status = 1
  AND P.frigeId = ? AND place = ?
  ORDER BY P.date
  LIMIT ${n41};
  `;
  const [selectListRows] = await connection.query(selectDateQuery , [ fridgeId,  place ]);
  return selectListRows;
}

async function selectFridgeHome423(connection, userId, fridgeId, place, n423) {
  const selectDateQuery = `
  SELECT productId, P.productName, 
     (SELECT
     IF(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date) > 0,
         CONCAT('D-', TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))
         ,CONCAT('D+', ABS(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))))
      ) AS date
  FROM Product P
  WHERE P.userId = ${userId} AND status = 1
  AND P.frigeId = ? AND place = ?
  ORDER BY P.date
  LIMIT ${n423};
  `;
  const [selectListRows] = await connection.query(selectDateQuery , [ fridgeId,  place ]);
  return selectListRows;
}

async function selectFridgeHome512(connection, userId, fridgeId, place, n512) {
  const selectDateQuery = `
  SELECT productId, P.productName, 
     (SELECT
     IF(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date) > 0,
         CONCAT('D-', TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))
         ,CONCAT('D+', ABS(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))))
      ) AS date
  FROM Product P
  WHERE P.userId = ${userId} AND status = 1
  AND P.frigeId = ? AND place = ?
  ORDER BY P.date
  LIMIT ${n512};
  `;
  const [selectListRows] = await connection.query(selectDateQuery , [ fridgeId,  place ]);
  return selectListRows;
}

async function selectFridgeHome534(connection, userId, fridgeId, place, n534) {
  const selectDateQuery = `
  SELECT productId, P.productName, 
     (SELECT
     IF(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date) > 0,
         CONCAT('D-', TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))
         ,CONCAT('D+', ABS(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))))
      ) AS date
  FROM Product P
  WHERE P.userId = ${userId} AND status = 1
  AND P.frigeId = ? AND place = ?
  ORDER BY P.date
  LIMIT ${n534};
  `;
  const [selectListRows] = await connection.query(selectDateQuery , [ fridgeId,  place ]);
  return selectListRows;
}

async function selectFridgeHome6(connection, userId, fridgeId, place, n6) {
  const selectDateQuery = `
  SELECT productId, P.productName, 
     (SELECT
     IF(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date) > 0,
         CONCAT('D-', TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))
         ,CONCAT('D+', ABS(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))))
      ) AS date
  FROM Product P
  WHERE P.userId = ${userId} AND status = 1
  AND P.frigeId = ? AND place = ?
  ORDER BY P.date
  LIMIT ${n6};
  `;
  const [selectListRows] = await connection.query(selectDateQuery , [ fridgeId,  place ]);
  return selectListRows;
}

// 식재료 삭제
async function deleteProduct(connection, userId, fridgeId, place, productId ) {
  const updateListQuery = `
    UPDATE Product
    SET status = 0
    WHERE userId = ? AND status = 1
    AND frigeId = ? AND place = ?
    AND productId = ?;
  `;
  const [updateListRows] = await connection.query(updateListQuery , [  userId, fridgeId, place, productId ]);
  return updateListRows;
}
// place에 productId가 있는지
async function existProductIdInPlace(connection, userId, fridgeId, place, productId) {
  const selectDateQuery = `
  SELECT EXISTS(
    SELECT *
    FROM Product
    WHERE userId = ?  AND status = 1
    AND frigeId = ? AND place = ?
    AND productId = ?
    ) AS exist;
  `;
  const [selectListRows] = await connection.query(selectDateQuery , [ userId, fridgeId, place, productId ]);
  return selectListRows;
}
// 식재료 상세 정보 조회
async function productDetailInfo(connection, productId) {
  const selectDateQuery = `
  SELECT productName,
  (SELECT
     IF(TIMESTAMPDIFF(DAY, CURRENT_DATE(), date) > 0,
         CONCAT('D-', TIMESTAMPDIFF(DAY, CURRENT_DATE(), date))
         ,CONCAT('D+', ABS(TIMESTAMPDIFF(DAY, CURRENT_DATE(), date))))
  ) AS date,
  productCount
  FROM Product
  WHERE productId = ? AND status = 1;
  `;
  const [selectListRows] = await connection.query(selectDateQuery , productId);
  return selectListRows;
}

// 상품 정보 수정
async function updateProduct(connection, productId, productCount, finalDate ) {
  const updateListQuery = `
    UPDATE Product
    SET date = ? , productCount = ?
    WHERE productId = ? AND status = 1;
  `;
  const [updateListRows] = await connection.query(updateListQuery , [ finalDate, productCount, productId ]);
  return updateListRows;
}
// 냉장고 속 식재료 조회
async function selectFridgeBySearch(connection, userId, search) {
  const selectDateQuery = `
  SELECT P.frigeId, F.fridgeType, place,
         productId, P.productName, P.productCount,
     (SELECT
     IF(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date) > 0,
         CONCAT('D-', TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))
         ,CONCAT('D+', ABS(TIMESTAMPDIFF(DAY, CURRENT_DATE(), P.date))))
      ) AS date
  FROM Product P
  INNER JOIN Fridge F on P.frigeId = F.frigeId
  WHERE P.userId = ${userId} AND P.status = 1
  AND P.productName = ? AND F.status = 1
  ORDER BY P.date
  LIMIT 3;
  `;
  const [selectListRows] = await connection.query(selectDateQuery , search );
  return selectListRows;
}

// 유통기한 제한
async function receiptLimit(connection, userId) {
  const insertListQuery = `
    INSERT INTO Receipt(userId) VALUES(?);
  `;
  const [insertListRows] = await connection.query(insertListQuery , userId);
  return insertListRows;
}

// 영수증 일주일의 횟수 조회
async function retrieveReceiptCount(connection, userId) {
  const selectListQuery = `
  SELECT count(*) AS count
  FROM Receipt
  WHERE userId = ?
    AND date(createAt) BETWEEN
      (SELECT
      if(weekday(someday) != 0, date_sub(someday, interval weekday(someday) day), someday) AS Monday
      FROM
      (SELECT CURRENT_DATE AS someday) AS t)
      AND
      (SELECT
       if(weekday(someday) != 6,
       if(weekday(someday) > 6, date_sub(someday, interval weekday(someday)-6 day), date_add(someday, interval 6-weekday(someday) day)),
       someday) AS Friday
      FROM
      (SELECT CURRENT_DATE AS someday) AS t);
  `;
  const [selectListRows] = await connection.query(selectListQuery , userId );
  return selectListRows;
}

// 검색어 추가
async function insertSearch(connection, userId, search) {
  const insertListQuery = `
  INSERT INTO MySearch(userId, search) 
  VALUES(?, ?);
  `;
  const [insertListRows] = await connection.query(insertListQuery , [ userId, search ] );
  return insertListRows;
}
// mysearch안에 search 존재하는지
async function existMySearch(connection, userId, search) {
  const selectDateQuery = `
      SELECT *
      FROM MySearch
      WHERE userId = ?
      AND search = ?
      AND status = 1;
  `;
  const [selectListRows] = await connection.query(selectDateQuery , [ userId, search ] );
  return selectListRows;
}

// 조회할 수 있는 친구 냉장고 
async function selectFriendFridge(connection, userId) {
  const selectDateQuery = `
  SELECT F.userId, CONCAT(nickName, '의 냉장고') AS name
  FROM Friend F
  INNER JOIN User U on F.userId = U.userId
  WHERE otherId = 1
    AND F.status = 1 
    AND U.status = 1
  ORDER BY F.createAt;
  `;
  const [selectListRows] = await connection.query(selectDateQuery , userId );
  return selectListRows;
}

  module.exports = {
    selectSearchList,
    deleteSearch,
    retrieveFridgeCount,
    selectRegisterDate,
    insertProduct,
    selectExpirationDate,
    selectFridgeDetail,
    selectFridgeHome1,
    selectFridgeHome2,
    selectFridgeHome3,
    selectFridgeHome41,
    selectFridgeHome423,
    selectFridgeHome512,
    selectFridgeHome534,
    selectFridgeHome6,

    deleteProduct,
    existProductIdInPlace,
    productDetailInfo,
    updateProduct,
    selectFridgeBySearch,
    receiptLimit,
    retrieveReceiptCount,
    insertSearch,
    existMySearch,
    selectFriendFridge,
  };
  
  