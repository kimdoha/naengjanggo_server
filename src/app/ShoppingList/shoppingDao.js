// 리스트 상품 추가
async function insertListInfo(connection, userId, product) {
    const insertListQuery = `
    INSERT INTO ShoppingList(userId , content) VALUES (?, ?);
    `;
    const [insertListRows] = await connection.query(insertListQuery, [userId, product]);
    return insertListRows;
  }
  
// listId 유효성 검사
async function selectListId(connection, userId, listId) {
    const selectListIdQuery = `
    SELECT EXISTS (SELECT * FROM ShoppingList WHERE userId = ? AND status = 1 AND listId = ?) as exist;
    `;
    const [selectListRows] = await connection.query(selectListIdQuery, [userId, listId]);
    return selectListRows;
  }
  
async function selectProductByListId(connection, userId, listId) {
    const selectProductQuery = `
    SELECT content FROM ShoppingList WHERE userId = ? AND status = 1 AND listId = ?;
    `;
    const [selectListRows] = await connection.query(selectProductQuery , [userId, listId]);
    return selectListRows;
  }

// 장보기리스트 삭제
async function deleteListInfo(connection, userId, listId) {
    const deleteProductQuery = `
    UPDATE ShoppingList SET status = 0 WHERE userId = ? AND listId = ?;
    `;
    const [deleteListRows] = await connection.query(deleteProductQuery , [userId, listId]);
    return deleteListRows;
  }
// 장보기리스트 조회
async function setVariable(connection) {
    const setQuery = `
            SET @a := 0;
    `;
    await connection.query(setQuery);
    return;
  }

async function selectProductByToday(connection, userId, date) {
    const selectProductQuery = `
    SELECT listId AS idx, content
    FROM ShoppingList
    WHERE status = 1 AND userId = ?
    AND DATE(createAt) = ?
    LIMIT 100;
    `;
    const [selectListRows] = await connection.query(selectProductQuery , [ userId, date ] );
    console.log(selectListRows);
    return selectListRows;
  }

  // 날짜별 상품 조회
async function selectProductByMonth(connection, userId , date) {
    const selectProductQuery = `
        SELECT listId AS idx,  content
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

  //  오늘의 날짜 조회
  async function selectLatestDate(connection, userId) {
    const selectDateQuery = `
        SELECT DISTINCT DATE_FORMAT(createAt, '%Y-%m-%d') AS date
        FROM ShoppingList
        ORDER BY createAt DESC
        LIMIT 1;
    `;
    const [selectListRows] = await connection.query(selectDateQuery , userId);
    return selectListRows;
  }
// 오늘의 식재료 메세지 조회 
async function retrieveProductMessage(connection, userId, search) {
  const selectListQuery = `
  SELECT CONCAT(
    '* 현재 ',
    (SELECT nickName
    FROM User
    WHERE userId = ${userId})
    ,' 냉장고에 ',
    ? , ' ',
    (SELECT SUM(productCount)
    FROM Product
    WHERE productName = ?
      AND userId = ${userId} AND status = 1),
    '개가 남아있어요.') AS message;
  `;
  const [selectListRows] = await connection.query(selectListQuery, [ search, search ]);
  return selectListRows;
}

async function retrieveProductCount(connection, userId, search) {
  const selectListQuery = `
    SELECT SUM(productCount) AS productCount
    FROM Product
    WHERE productName = ?
    AND userId = ? AND status = 1;
  `;
  const [selectListRows] = await connection.query(selectListQuery , [  search , userId]);
  return selectListRows;
}
  module.exports = {
    insertListInfo,
    selectListId,
    selectProductByListId,
    deleteListInfo,
    setVariable,
    selectProductByToday,
    selectProductByMonth,
    selectDateByMonth,
    selectLatestDate,
    retrieveProductMessage,
    retrieveProductCount,

  };
  
  