// 댓글 작성 API
async function postComment(connection, userId, postId, content) {
    const insertListQuery = `
    INSERT INTO Comment(postId, userId, content) 
    VALUES(?, ?, ?);
    `;
    const [insertListRows] = await connection.query( insertListQuery, [ postId, userId, content] );
    return insertListRows;
  }

// 대댓글 작성 API
async function selectCommentInPost(connection, postId, commentId) {
    const selectListQuery = `
    SELECT *
    FROM Comment
    WHERE postId = ? AND commentId = ?
    AND status = 1;
    `;
    const [selectListRows] = await connection.query( selectListQuery, [ postId, commentId ] );
    return selectListRows;
  }

// 대댓글 작성
async function postReComment(connection, commentId, userId, content) {
    const insertListQuery = `
      INSERT INTO Comments(commentId, userId, content)
      VALUES(?, ?, ?);
    `;
    const [insertListRows] = await connection.query(insertListQuery, [commentId, userId, content ]);
    return insertListRows;
  }

// 댓글 조회 API
async function selectComment(connection, postId) {
  const selectListQuery = `
  SELECT commentId,
  nickName,
  profileImg,
   (CASE
       WHEN TIMESTAMPDIFF(MINUTE, C.createAt, now()) <= 0 THEN '방금 전'
       WHEN TIMESTAMPDIFF(MINUTE, C.createAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, C.createAt, NOW()), '분 전')
       WHEN TIMESTAMPDIFF(HOUR, C.createAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, C.createAt, NOW()), '시간 전')
       ELSE DATE_FORMAT(C.createAt, "%Y.%m.%d")
   END) AS date,
  content,
  (SELECT count(*)
   FROM Comments CS
   WHERE commentId = C.commentId AND CS.status = 1) AS reply,
   (SELECT count(*)
   FROM Like1
   WHERE status = 1 AND commentId = C.commentId) AS likeCount

    FROM Comment C
    INNER JOIN User U on C.userId = U.userId
    WHERE postId = ? AND C.status = 1;
  `;
  const [selectListRows] = await connection.query(selectListQuery, postId);
  return selectListRows;
}

// 댓글 좋아요 API
async function likeComment(connection, userId, commentId) {
  const insertListQuery = `
  INSERT INTO Like1(commentId, userId)
  VALUES(?, ?);
  `;
  const [insertListRows] = await connection.query( insertListQuery, [ commentId, userId ] );
  return insertListRows;
  }
// 대댓글 조회 API
async function selectReComment(connection, commentId) {
    const selectListQuery = `
    SELECT commentId,
    nickName,
    profileImg,
    (CASE
        WHEN TIMESTAMPDIFF(MINUTE, CS.createAt, now()) <= 0 THEN '방금 전'
        WHEN TIMESTAMPDIFF(MINUTE, CS.createAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, CS.createAt, NOW()), '분 전')
        WHEN TIMESTAMPDIFF(HOUR, CS.createAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, CS.createAt, NOW()), '시간 전')
        ELSE DATE_FORMAT(CS.createAt, "%Y.%m.%d")
    END) AS date,
    content,
     (SELECT count(*)
     FROM Like2
     WHERE status = 1 AND commentsId = CS.commentsId) AS likeCount

    FROM Comments CS
    INNER JOIN User U on CS.userId = U.userId
    WHERE commentId = ? AND CS.status = 1;
    `;
    const [selectListRows] = await connection.query(selectListQuery, commentId);
    return selectListRows;
  }
// 대댓글 좋아요 
async function selectCommentsInComment(connection, commentId, commentsId) {
  const selectListQuery = `
    SELECT *
    FROM Comments
    WHERE commentId = ? AND commentsId = ?
    AND status = 1;
  `;
  const [selectListRows] = await connection.query( selectListQuery, [ commentId, commentsId ] );
  return selectListRows;
}

async function like2Comment(connection, userId, commentsId) {
    const insertListQuery = `
    INSERT INTO Like2(commentsId, userId)
    VALUES(?, ?);
    `;
    const [insertListRows] = await connection.query(insertListQuery, [commentsId, userId]);
    return insertListRows;
}
// 댓글 삭제
async function deleteComment(connection, userId, commentId) {
    const updateListQuery = `
      UPDATE Comment
      SET status = 0
      WHERE commentId = ${commentId} AND userId = ${userId};
    `;
    const [updateListRows] = await connection.query(updateListQuery);
    return updateListRows;
  }
// 대댓글 삭제
async function deleteReComment(connection, userId, commentsId) {
  const updateListQuery = `
    UPDATE Comments
    SET status = 0
    WHERE commentsId = ${commentsId} AND userId = ${userId};
  `;
  const [updateListRows] = await connection.query(updateListQuery);
  return updateListRows;
}

// 댓글 편집
async function patchComment(connection, userId, commentId, content) {
    const updateListQuery = `
    UPDATE Comment
    SET content = ?
    WHERE userId = ? AND commentId = ?
    AND status = 1;
    `;
    const [updateListRows] = await connection.query(updateListQuery, [content, userId, commentId]);
    return updateListRows;
}
// 대댓글 편집
  async function patchReComment(connection, userId, content, commentsId) {
    const updateListQuery = `
      UPDATE Comments
      SET content = ?
      WHERE userId = ? AND commentsId = ?
      AND status = 1;
    `;
    const [updateListRows] = await connection.query(updateListQuery, [ content, userId, commentsId ]);
    return updateListRows;
  }
// 포스트 정보 retreive
// 작성자가 알람을 설정하였는지
async function retrievePostInfo(connection, postId) {
  const selectProductQuery = `
    SELECT registrationToken, title
    FROM Post P
    INNER JOIN Alarm A on P.userId = A.userId
    INNER JOIN User U on U.userId = P.userId
    WHERE P.postId = ? AND P.status = 1
    AND A.commentAlarm = 1 AND A.status = 1;
  `;
  const [selectListRows] = await connection.query(selectProductQuery , postId);
  return selectListRows;
}

  async function insertPost9(connection, userId, postId, content9, postImgUrl9) {
    const updateListQuery = `
    UPDATE PostContent
    SET content9 = ?, postImgUrl9 = ?
    WHERE userId = ${userId} AND postId = ${postId}
    AND status = 1;
    `;
    const [insertListRows] = await connection.query(updateListQuery, [content9, postImgUrl9]);
    return insertListRows;
  }
  async function insertPost10(connection, userId, postId, content10, postImgUrl10) {
    const updateListQuery = `
    UPDATE PostContent
    SET content10 = ?, postImgUrl10 = ?
    WHERE userId = ${userId} AND postId = ${postId}
    AND status = 1;
    `;
    const [insertListRows] = await connection.query(updateListQuery, [content10, postImgUrl10]);
    return insertListRows;
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
    postComment,
    selectCommentInPost,
    postReComment,
    selectComment,
    likeComment,
    selectReComment,
    selectCommentsInComment,
    like2Comment,
    deleteComment,
    deleteReComment,
    patchComment,
    patchReComment,
    retrievePostInfo,

  };
  
  