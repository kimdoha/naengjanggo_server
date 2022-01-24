  
// 음식물 쓰레기 유저 정보 조회
async function existUserWasteInfo(connection, userId) {
    const selectListQuery = `
    SELECT *
    FROM FoodWaste
    WHERE userId = ? 
      AND status = 1;
    `;
    const [selectListRows] = await connection.query(selectListQuery, userId);
    return selectListRows;
  }

// 음식물 쓰레기 유저 정보 저장
async function saveUserInfo(connection, userId ,id, password, tagnum, dong, ho) {
    const insertListQuery = `
    INSERT FoodWaste(userId, homepageID, homepagePW, dong, ho, tagNum) 
    VALUES (?, ?, ?, ?, ?, ?);
    `;
    const [insertListRows] = await connection.query(insertListQuery, [ userId ,id, password, dong, ho, tagnum ]);
    return insertListRows;
  }

// 음식물 쓰레기 유저 정보 업데이트
async function updateUserInfo1(connection, userId ,id, password, tagnum, dong, ho) {
  const updateListQuery = `
  UPDATE FoodWaste
  SET homepageID = ?, homepagePW = ?, dong = ?, ho = ?, tagNum = ?
  WHERE status = 1 AND userId = ${userId};
  `;
  const [updateListRows] = await connection.query(updateListQuery, [ id, password, dong, ho ,tagnum]);
  return updateListRows;
}

async function updateUserInfo2(connection, userId ,tagnum, dong, ho) {
  const updateListQuery = `
  UPDATE FoodWaste
  SET dong = ?, ho = ?, tagNum = ?
  WHERE status = 1 AND userId = ${userId};
  `;
  const [updateListRows] = await connection.query(updateListQuery, [  dong, ho, tagnum ]);
  return updateListRows;
}


// id와 password에 변경 사항이 있는지
async function existChanged(connection, userId, id, password) {
    const selectProductQuery = `
    SELECT *
    FROM FoodWaste
    WHERE status = 1 AND userId = ?
    AND homepageID = ? AND homepagePW = ?;
    `;
    const [selectListRows] = await connection.query(selectProductQuery , [ userId, id, password ]);
    return selectListRows;
  }

// 시작 날짜와 종료 날짜 조회

async function retrieveDate(connection, month) {
  const selectProductQuery = `
  SELECT DATE_FORMAT(CONCAT(YEAR(CURRENT_DATE()), '-',  LPAD(?, '2', '0'), '-01'), '%Y-%m-%d') AS start,
    DATE_FORMAT(LAST_DAY(CONCAT(YEAR(CURRENT_DATE()), '-',  LPAD(?, '2', '0'), '-01')), '%Y-%m-%d') AS end;
  `;
  const [selectListRows] = await connection.query(selectProductQuery, [month, month]);
  return selectListRows;
}

async function deleteListInfo(connection, userId, listId) {
    const deleteProductQuery = `
    UPDATE ShoppingList SET status = 0 WHERE userId = ? AND listId = ?;
    `;
    const [deleteListRows] = await connection.query(deleteProductQuery , [userId, listId]);
    return deleteListRows;
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

  // 날짜별 상품 조회
async function selectProductByMonth(connection, userId , date) {
    const selectProductQuery = `
        SELECT ( @a := @a+1 ) AS idx,  content
        FROM ShoppingList
        WHERE DATE(createAt) BETWEEN DATE_ADD(NOW() ,INTERVAL -1 MONTH ) AND NOW()
        AND status = 1
        AND userId = ? AND DATE(createAt) = ?;
    `;
    const [selectListRows] = await connection.query(selectProductQuery , [userId, date]);
    return selectListRows;
  }

  async function selectDateByMonth(connection, userId) {
    const selectDateQuery = `
        SELECT DISTINCT DATE_FORMAT(createAt, '%Y-%m-%d') AS date
        FROM ShoppingList
        WHERE DATE(createAt) BETWEEN DATE_ADD(NOW() ,INTERVAL -1 MONTH ) AND NOW()
        AND status = 1
        AND userId = ?
        ORDER BY DATE(createAt) DESC;
    `;
    const [selectListRows] = await connection.query(selectDateQuery , userId);
    return selectListRows;
  }
  module.exports = {
    existUserWasteInfo,
    saveUserInfo,
    updateUserInfo1,
    updateUserInfo2,
    existChanged,
    retrieveDate,
  };
  
  