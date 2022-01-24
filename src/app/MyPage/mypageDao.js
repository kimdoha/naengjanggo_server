//커뮤니티 최신순 정렬
async function dataOrderByRecent(connection, category, userId, page, size) {
    const selectListQuery = `
    SELECT postId, title, mainImg,
    IFNULL(
     (SELECT status
    FROM Jjim
     WHERE userId = ${userId}
       AND postId = P.postId), 0) AS scrab,
     (SELECT count(*)
     FROM Jjim
     WHERE postId = P.postId
     AND status = 1) AS likeCount,
     (SELECT count(*)
     FROM Comment
     WHERE status = 1
       AND postId = P.postId) +
     (SELECT count(*)
     FROM Comments CS
     INNER JOIN Comment C on CS.commentId = C.commentId
     WHERE CS.status = 1 AND C.postId = P.postId
     AND C.status = 1) AS comments
 
     FROM Post P
     WHERE category = ${category} AND P.status = 1
     AND P.userId = ${userId}
     ORDER BY P.createAt DESC
     LIMIT ?, ?;

    `;
    const [selectListRows] = await connection.query(selectListQuery , [ page, size ]);
    return selectListRows;
  }

// 커뮤니티 조회순 정렬
async function dataOrderByCount(connection, category, userId, page, size) {
  const selectListQuery = `
SELECT postId, title, mainImg,
   IFNULL(
    (SELECT status
   FROM Jjim
    WHERE userId = ${userId}
      AND postId = P.postId), 0) AS scrab,
    (SELECT count(*)
    FROM Jjim
    WHERE postId = P.postId
    AND status = 1) AS likeCount,
    (SELECT count(*)
    FROM Comment
    WHERE status = 1
      AND postId = P.postId) +
    (SELECT count(*)
    FROM Comments CS
    INNER JOIN Comment C on CS.commentId = C.commentId
    WHERE CS.status = 1 AND C.postId = P.postId
    AND C.status = 1) AS comments

    FROM Post P
    WHERE category = ${category} AND P.status = 1
    AND P.userId = ${userId}
    ORDER BY (SELECT count(*) FROM Watched W WHERE W.postId = P.postId) DESC
    LIMIT ?, ?;

  `;
  const [selectListRows] = await connection.query(selectListQuery , [ page, size ]);
  return selectListRows;
}
// 커뮤니티 과거순 정렬
async function dataOrderByOld(connection, category, userId, page, size) {
  const selectListQuery = `
  SELECT postId, title, mainImg,
  IFNULL(
   (SELECT status
  FROM Jjim
   WHERE userId = ${userId}
     AND postId = P.postId), 0) AS scrab,
   (SELECT count(*)
   FROM Jjim
   WHERE postId = P.postId
   AND status = 1) AS likeCount,
   (SELECT count(*)
   FROM Comment
   WHERE status = 1
     AND postId = P.postId) +
   (SELECT count(*)
   FROM Comments CS
   INNER JOIN Comment C on CS.commentId = C.commentId
   WHERE CS.status = 1 AND C.postId = P.postId
   AND C.status = 1) AS comments

   FROM Post P
   WHERE category = ${category} AND P.status = 1
   AND P.userId = ${userId}
   ORDER BY P.createAt
   LIMIT ?, ?;

  `;
  const [selectListRows] = await connection.query(selectListQuery , [ page, size ]);
  return selectListRows;
}

// 스크랩순
async function dataOrderByScrab(connection, category, userId, page, size) {
  const selectListQuery = `
    SELECT postId, title, mainImg,
    IFNULL(
    (SELECT status
    FROM Jjim
    WHERE userId = ${userId}
        AND postId = P.postId), 0) AS scrab,
    (SELECT count(*)
    FROM Jjim
    WHERE postId = P.postId
    AND status = 1) AS likeCount,
    (SELECT count(*)
    FROM Comment
    WHERE status = 1
        AND postId = P.postId) +
    (SELECT count(*)
    FROM Comments CS
    INNER JOIN Comment C on CS.commentId = C.commentId
    WHERE CS.status = 1 AND C.postId = P.postId
    AND C.status = 1) AS comments

    FROM Post P
    WHERE category = ${category} AND P.status = 1
    AND P.userId = ${userId}
    ORDER BY scrab DESC
    LIMIT ?, ?;

  `;
  const [selectListRows] = await connection.query(selectListQuery , [ page, size ]);
  return selectListRows;
}
// 알람이 존재하는지
async function existAlarm(connection,  userId) {
    const selectListQuery = `
    SELECT *
    FROM Alarm
    WHERE status = 1 AND userId = ?;
    `;
    const [selectListRows] = await connection.query(selectListQuery, userId);
    return selectListRows;
  }

// 유통기한 알람 업데이트 Off
async function updateDateOff(connection, userId) {
  const patchListQuery = `
        UPDATE Alarm 
        SET dateAlarm = 0
        WHERE dateAlarm = 1 AND userId = ?;
  `;
  const [patchListRows] = await connection.query( patchListQuery, userId );
  return patchListRows;
}

// 유통기한 알람 업데이트 On
async function updateDateOn(connection, userId, day) {
    const patchListQuery = `
        UPDATE Alarm 
        SET dateAlarm = 1, dateDiff = ?
        WHERE dateAlarm = 0 AND userId = ?;
    `;
    const [patchListRows] = await connection.query(patchListQuery, [ day, userId ]);
    return patchListRows;
  }

// 유통기한 알람 업데이트 
async function updateDate(connection, userId, day) {
    const patchListQuery = `
        UPDATE Alarm 
        SET dateDiff = ?
        WHERE dateAlarm = 1 AND userId = ?;
    `;
    const [patchListRows] = await connection.query(patchListQuery, [ day, userId ]);
    return patchListRows;
  }

  // 댓글 알람 OFF
async function updateCommentOff(connection, userId) {
  const patchListQuery = `
    UPDATE Alarm
    SET commentAlarm = 0
    WHERE commentAlarm = 1 AND userId = ?;
  `;
  const [patchListRows] = await connection.query( patchListQuery, userId );
  return patchListRows;
}

// 유통기한 알람 업데이트 On
async function updateCommentOn(connection, userId) {
    const patchListQuery = `
      UPDATE Alarm
      SET commentAlarm = 1
      WHERE commentAlarm = 0 AND userId = ?;
    `;
    const [patchListRows] = await connection.query(patchListQuery, userId);
    return patchListRows;
  }



async function selectMyAlarm(connection, userId) {
    const selectProductQuery = `
    SELECT commentAlarm, dateAlarm ,dateDiff
    FROM Alarm
    WHERE status = 1 AND userId = ?;
    `;
    const [selectListRows] = await connection.query(selectProductQuery , userId);
    return selectListRows;
  }

// 냉장고 타입 변경 
  async function changeFridge(connection, userId, fridgeId) {
    const deleteListQuery = `
      DELETE
      FROM Product
      WHERE frigeId = ? AND userId = ?;
    `;
    const [deleteListRows] = await connection.query(deleteListQuery, [ fridgeId, userId ]);
    return deleteListRows;
  }

async function changeType(connection, userId, fridgeId, type) {
    const patchListQuery = `
      UPDATE Fridge
      SET fridgeType = ?
      WHERE userId = ? 
      AND frigeId = ? 
      AND status = 1;
    `;
    const [patchListRows] = await connection.query(patchListQuery, [ type, userId, fridgeId ]);
    return patchListRows;
  }


// 냉장고 삭제 
  async function deleteFridge(connection, userId, fridgeId) {
    const deleteListQuery = `
    DELETE
    FROM Fridge
    WHERE frigeId = ? AND userId = ?;
    `;
    const [deleteListRows] = await connection.query(deleteListQuery, [ fridgeId, userId ]);
    return deleteListRows;
  }

// 냉장고 총 내가 몇개 가지고 있는지 => 한개면 삭제 불가 
async function totalFridgeCount(connection, userId) {
  const selectProductQuery = `
  SELECT count(*) AS count
  FROM Fridge
  WHERE status = 1 AND userId = ?;
  `;
  const [selectListRows] = await connection.query(selectProductQuery , userId);
  return selectListRows;
}

// 유저 탈퇴
async function deleteAlarm(connection, userId) {
  const deleteListQuery = `
  DELETE 
  FROM Alarm
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

async function deleteComment(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM Comment
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

async function deleteComments(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM Comments
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

async function deleteFoodWaste(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM FoodWaste
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

async function deleteFridgeByUserId(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM Fridge
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}


async function deleteFriend(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM Friend
  WHERE userId = ? OR otherId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, [ userId, userId ] );
  return deleteListRows;
}


async function deleteJjim(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM Jjim
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

async function deleteLike1(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM Like1
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

async function deleteLike2(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM Like2
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

async function deleteMySearch(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM MySearch
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

async function deleteNotice(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM Notice
  WHERE userId = ? 
   OR postId = (
     SELECT postId
     FROM Post
     WHERE userId = ?);
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, [ userId, userId ] );
  return deleteListRows;
}

async function deletePost(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM Post
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

async function deletePostContent(connection, userId) {
  const deleteListQuery = `
    DELETE
    FROM PostContent
    WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}


async function deleteProduct(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM Product
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

async function deleteReceipt(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM Receipt
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

async function deleteRecipe(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM Recipe
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

async function deleteScrab(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM Scrab
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

async function deleteShopping(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM ShoppingList
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}


async function deleteUser(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM User
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

async function deleteWatch(connection, userId) {
  const deleteListQuery = `
  DELETE
  FROM Watched
  WHERE userId = ?;
  `;
  const [deleteListRows] = await connection.query(deleteListQuery, userId);
  return deleteListRows;
}

  module.exports = {
    dataOrderByRecent,
    dataOrderByCount,
    dataOrderByOld,
    dataOrderByScrab,
    existAlarm,
    updateDateOff,
    updateDateOn,
    updateDate,
    updateCommentOff,
    updateCommentOn,
    selectMyAlarm,
    changeFridge,
    changeType,
    deleteFridge,
    totalFridgeCount,

    deleteAlarm,
    deleteComment,
    deleteComments,
    deleteFoodWaste,
    deleteFridgeByUserId,
    deleteFriend,
    deleteJjim,
    deleteLike1,
    deleteLike2,
    deleteMySearch,
    deleteNotice,
    deletePost,
    deletePostContent,
    deleteProduct,
    deleteReceipt,
    deleteRecipe,
    deleteScrab,
    deleteShopping,
    deleteUser,
    deleteWatch,

  };
  
  