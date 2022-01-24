// 유저 관리자 조회
async function checkUserManager(connection, userId) {
    const selectListQuery = `
        SELECT EXISTS
        (SELECT * FROM User WHERE userId = ? 
        AND manager = 'Y') 
        AS exist;
    `;
    const [selectListRows] = await connection.query( selectListQuery, userId );
    return selectListRows;
  }

// 글 포스팅
async function insertPost(connection, userId, title, category, postImgUrl1) {
    const insertListQuery = `
    INSERT INTO Post(userId, title, category, mainImg) 
    VALUES (?, ?, ?, ?);
    `;
    const [insertListRows] = await connection.query(insertListQuery, [userId, title, category, postImgUrl1 ]);
    return insertListRows;
  }

async function selectPostId(connection, userId, title, category) {
    const selectListQuery = `
    SELECT postId
    FROM Post
    WHERE userId = ? AND status = 1
    AND title = ? AND category = ? 
    ORDER BY createAt DESC
    LIMIT 1;
    `;
    const [selectListRows] = await connection.query(selectListQuery, [userId, title, category ]);
    console.log(selectListRows)
    return selectListRows;
  }

async function insertPost1(connection, userId, postId, content1, postImgUrl1) {
    const insertListQuery = `
    INSERT INTO PostContent(userId, postId, content1, postImgUrl1) 
    VALUES (?, ?, ?, ?);
    `;
    const [insertListRows] = await connection.query(insertListQuery, [userId, postId, content1, postImgUrl1 ]);
    return insertListRows;
  }

async function insertPost2(connection, userId, postId, content2, postImgUrl2) {
    const updateListQuery = `
    UPDATE PostContent
    SET content2 = ?, postImgUrl2 = ?
    WHERE userId = ${userId} AND postId = ${postId}
    AND status = 1;
    `;
    const [insertListRows] = await connection.query(updateListQuery, [content2, postImgUrl2]);
    return insertListRows;
  }

async function insertPost3(connection, userId, postId, content3, postImgUrl3) {
    const updateListQuery = `
    UPDATE PostContent
    SET content3 = ?, postImgUrl3 = ?
    WHERE userId = ${userId} AND postId = ${postId}
    AND status = 1;
    `;
    const [insertListRows] = await connection.query(updateListQuery, [content3, postImgUrl3]);
    return insertListRows;
  }
async function insertPost4(connection, userId, postId, content4, postImgUrl4) {
    const updateListQuery = `
    UPDATE PostContent
    SET content4 = ?, postImgUrl4 = ?
    WHERE userId = ${userId} AND postId = ${postId}
    AND status = 1;
    `;
    const [insertListRows] = await connection.query(updateListQuery, [content4, postImgUrl4]);
    return insertListRows;
  }
  async function insertPost5(connection, userId, postId, content5, postImgUrl5) {
    const updateListQuery = `
    UPDATE PostContent
    SET content5 = ?, postImgUrl5 = ?
    WHERE userId = ${userId} AND postId = ${postId}
    AND status = 1;
    `;
    const [insertListRows] = await connection.query(updateListQuery, [content5, postImgUrl5]);
    return insertListRows;
  }
  async function insertPost6(connection, userId, postId, content6, postImgUrl6) {
    const updateListQuery = `
    UPDATE PostContent
    SET content6 = ?, postImgUrl6 = ?
    WHERE userId = ${userId} AND postId = ${postId}
    AND status = 1;
    `;
    const [insertListRows] = await connection.query(updateListQuery, [content6, postImgUrl6]);
    return insertListRows;
  }
  async function insertPost7(connection, userId, postId, content7, postImgUrl7) {
    const updateListQuery = `
    UPDATE PostContent
    SET content7 = ?, postImgUrl7 = ?
    WHERE userId = ${userId} AND postId = ${postId}
    AND status = 1;
    `;
    const [insertListRows] = await connection.query(updateListQuery, [content7, postImgUrl7]);
    return insertListRows;
  }
  async function insertPost8(connection, userId, postId, content8, postImgUrl8) {
    const updateListQuery = `
    UPDATE PostContent
    SET content8 = ?, postImgUrl8 = ?
    WHERE userId = ${userId} AND postId = ${postId}
    AND status = 1;
    `;
    const [insertListRows] = await connection.query(updateListQuery, [content8, postImgUrl8]);
    return insertListRows;
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

// 북마크 설정 및 해제
async function selectPostByPostId(connection, category, postId) {
  const selectListQuery = `
    SELECT *
    FROM Post
    WHERE category = ?
    AND status = 1 AND postId = ?;
  `;
  const [selectListRows] = await connection.query(selectListQuery , [ category, postId ] );
  return selectListRows;
}

async function selectJjim(connection, userId, postId) {
  const selectListQuery = `
    SELECT EXISTS(SELECT *
    FROM Jjim
    WHERE userId = ? AND postId = ?) AS exist;
  `;
  const [selectListRows] = await connection.query(selectListQuery , [ userId, postId ] );
  return selectListRows;
}

async function addJjim(connection, userId, postId) {
  const insertListQuery = `
    INSERT INTO Jjim(userId, postId) 
    VALUES (?, ?);
  `;
  const [insertListRows] = await connection.query(insertListQuery, [ userId, postId ]);
  return insertListRows;
}

async function selectJjimStatus(connection, userId, postId) {
  const selectListQuery = `
      SELECT status
      FROM Jjim
      WHERE userId = ? AND postId = ?;
  `;
  const [selectListRows] = await connection.query(selectListQuery , [ userId, postId ] );
  return selectListRows;
}

async function deleteJjim(connection, userId, postId) {
  const updateListQuery = `
    UPDATE Jjim SET status = 0
    WHERE userId = ? AND postId = ?;
  `;
  const [updateListRows] = await connection.query(updateListQuery, [ userId, postId ]);
  return updateListRows;
}

async function updateJjim(connection, userId, postId) {
  const updateListQuery = `
    UPDATE Jjim SET status = 1
    WHERE userId = ? AND postId = ?;
  `;
  const [updateListRows] = await connection.query(updateListQuery, [ userId, postId ]);
  return updateListRows;
}

//커뮤니티 최신순 정렬
async function dataOrderByRecent(connection, category, userId, page, size) {
    const selectListQuery = `
    SELECT title, mainImg,
    IFNULL((SELECT status FROM Jjim WHERE userId = ${userId} AND postId = P.postId), 0) AS scrab
    FROM Post P
    WHERE category = ${category} AND P.status = 1
    ORDER BY P.createAt DESC
    LIMIT ?, ?;

    `;
    const [selectListRows] = await connection.query(selectListQuery , [ page, size ]);
    return selectListRows;
  }
// 커뮤니티 조회순 정렬
async function dataOrderByCount(connection, category, userId, page, size) {
  const selectListQuery = `
    SELECT title, mainImg, postId,
    IFNULL((SELECT status FROM Jjim WHERE userId = ${userId} AND postId = P.postId), 0) AS scrab
    FROM Post P
    WHERE category = ${category} AND P.status = 1
    ORDER BY (SELECT count(*) FROM Watched W WHERE W.postId = P.postId) DESC
    LIMIT ?, ?;

  `;
  const [selectListRows] = await connection.query(selectListQuery , [ page, size ]);
  return selectListRows;
}
// 커뮤니티 과거순 정렬
async function dataOrderByOld(connection, category, userId, page, size) {
  const selectListQuery = `
    SELECT title, mainImg,
    IFNULL((SELECT status FROM Jjim WHERE userId = ${userId} AND postId = P.postId), 0) AS scrab
    FROM Post P
    WHERE category = ${category} AND P.status = 1
    ORDER BY P.createAt
    LIMIT ?, ?;

  `;
  const [selectListRows] = await connection.query(selectListQuery , [ page, size ]);
  return selectListRows;
}

// 스크랩순
async function dataOrderByScrab(connection, category, userId, page, size) {
  const selectListQuery = `
      SELECT title, mainImg,
      IFNULL((SELECT status FROM Jjim WHERE userId = ${userId} AND postId = P.postId), 0) AS scrab
      FROM Post P
      WHERE category = ${category} AND P.status = 1
      ORDER BY scrab DESC
      LIMIT ?, ?;

  `;
  const [selectListRows] = await connection.query(selectListQuery , [ page, size ]);
  return selectListRows;
}
// 세부 글 조회
async function selectPostDetail(connection, userId , category, postId) {
  const selectListQuery = `
  
SELECT U.userId, nickName, profileImg,
        title, category, mainImg,
       IFNULL(
        (SELECT status 
        FROM Jjim WHERE userId = ${userId} 
        AND postId = P.postId), 0) AS scrab,
       (SELECT count(*) 
       FROM Watched W 
       WHERE W.postId = P.postId) AS watch,
       (CASE
          WHEN TIMESTAMPDIFF(MINUTE, P.createAt, now()) <= 0 THEN '방금 전'
          WHEN TIMESTAMPDIFF(MINUTE, P.createAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, P.createAt, NOW()), '분 전')
          WHEN TIMESTAMPDIFF(HOUR, P.createAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, P.createAt, NOW()), '시간 전')
          ELSE DATE_FORMAT(P.createAt, "%Y-%m-%d")
        END) AS date,

       content1, postImgUrl1,
       content2, postImgUrl2,
       content3, postImgUrl3,
       content4, postImgUrl4,
       content5, postImgUrl5,
       content6, postImgUrl6,
       content7, postImgUrl7,
       content8, postImgUrl8,
       content9, postImgUrl9,
       content10, postImgUrl10

      FROM Post P
      INNER JOIN PostContent PC on P.postId = PC.postId
      INNER JOIN User U on U.userId = P.userId
      WHERE P.category = ${category} AND P.postId = ${postId} 
      AND P.status = 1 AND PC.status = 1;
  `;
  const [selectListRows] = await connection.query(selectListQuery);
  return selectListRows;
}
// 조회수 증가
async function addWatchCount(connection, userId, postId) {
  const insertListQuery = `
    INSERT INTO Watched(userId, postId) VALUES(?, ?);
  `;
  const [insertListRows] = await connection.query(insertListQuery , [ userId, postId ]);
  return insertListRows;
}
// 찜 - 커뮤니티
async function selectJjimPost(connection, userId, page, size) {
  const selectListQuery = `
    SELECT P.postId, title, mainImg,
    IFNULL((SELECT status FROM Jjim WHERE userId = ${userId} AND postId = P.postId), 0) AS scrab
    FROM Jjim J
    INNER JOIN Post P on J.postId = P.postId
    WHERE P.status = 1 
    AND J.userId = ${userId} 
    AND J.status = 1
    ORDER BY J.createAt DESC
    LIMIT ?, ?;
  `;
  const [selectListRows] = await connection.query(selectListQuery, [page, size]);
  return selectListRows;
}

// 글 수정 
async function updatePost(connection, userId, postId, title, category, postImgUrl1) {
  const updateListQuery = `
  UPDATE Post
  SET category = ${category}, title = ?, mainImg = ?
  WHERE postId = ${postId}
    AND status = 1
    AND userId = ${userId};
  `;
  const [updateListRows] = await connection.query(updateListQuery, [title, postImgUrl1]);
  return updateListRows;
}
async function updatePost1(connection, userId, postId, content1, postImgUrl1) {
  const updateListQuery = `
  UPDATE PostContent
  SET content1 = ?, postImgUrl1 = ?
  WHERE postId = ${postId}
    AND status = 1
    AND userId = ${userId};
  `;
  const [updateListRows] = await connection.query(updateListQuery, [content1, postImgUrl1]);
  return updateListRows;
}

// 해당 postId가 존재하는지
async function existPostByPostId(connection, postId) {
  const selectListQuery = `
      SELECT * 
      FROM Post
      WHERE postId = ${postId} AND status = 1;
  `;
  const [selectListRows] = await connection.query(selectListQuery);
  return selectListRows;
}

// 게시글 신고
async function insertDeclaration(connection, userId, postId, reason) {
  const insertListQuery = `
  INSERT INTO Notice(postId, userId, cause) 
  VALUES (?, ?, ?);
  `;
  const [insertListRows] = await connection.query(insertListQuery, [ postId, userId, reason ]);
  return insertListRows;
}
// 해당 게시글에 대한 신고 수 체크
async function retrieveDeclarationCount(connection, postId) {
  const selectListQuery = `
    SELECT IFNULL(count(*), 0) AS count
    FROM Notice
    WHERE postId = ${postId};
  `;
  const [selectListRows] = await connection.query(selectListQuery);
  return selectListRows[0];
}

// 내가 신고했는지
async function existDeclaration(connection, userId, postId) {
  const selectListQuery = `
  SELECT EXISTS(
    SELECT *
    FROM Notice
    WHERE postId = ${postId} AND userId = ${userId}
  ) AS exist;
  `;
  const [selectListRows] = await connection.query(selectListQuery);
  return selectListRows;
}

// 게시글 삭제
async function deletePost(connection, postId) {
  const updateListQuery = `
    UPDATE Post 
    SET status = 0 
    WHERE PostId = ${postId};
  `;
  const [updateListRows] = await connection.query(updateListQuery);
  return updateListRows;
}

// 게시글 세부 콘텐츠들 삭제 
async function deletePostContent(connection, postId) {
  const updateListQuery = `
    UPDATE PostContent
    SET status = 0
    WHERE PostId = ${postId};
  `;
  const [updateListRows] = await connection.query(updateListQuery);
  return updateListRows;
}
// 신고한 사람 확인
async function searchPostUser(connection, postId) {
  const selectListQuery = `
    SELECT DISTINCT P.userId
    FROM Notice N
    INNER JOIN Post P on N.postId = P.postId
    WHERE N.postId = ${postId};
  `;
  const [selectListRows] = await connection.query(selectListQuery);
  return selectListRows;
}

// 사용자 정지 
async function updateUserStatus(connection, user) {
  const updateListQuery = `
      UPDATE User
      SET status = 0
      WHERE userId = ${user};
  `;
  const [updateListRows] = await connection.query(updateListQuery);
  return updateListRows;
}

// commentId 리스트
async function selectCommentId(connection, postId) {
  const selectListQuery = `
    SELECT commentId
    FROM Comment
    WHERE postId = ? AND status = 1;
  `;
  const [selectListRows] = await connection.query(selectListQuery,  postId );
  return selectListRows;
}
// postId 내가 쓴 게 맞는지
async function checkDeleteUser(connection, userId, postId) {
  const selectListQuery = `
    SELECT *
    FROM Post
    WHERE userId = ? AND postId = ?
    AND status = 1;
  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, postId ]);
  return selectListRows;
}

// 대댓글 삭제 
async function deleteReComment(connection, commentId) {
  const updateListQuery = `
    UPDATE Comments 
    SET status = 0
    WHERE commentId = ? 
    AND status = 1;
  `;
  const [updateListRows] = await connection.query(updateListQuery , commentId);
  return updateListRows;
}


// 댓글 삭제 
async function deleteComment(connection, commentId) {
  const updateListQuery = `
    UPDATE Comment
    SET status = 0
    WHERE commentId = ?
    AND status = 1;
  `;
  const [updateListRows] = await connection.query(updateListQuery , commentId);
  return updateListRows;
}

  module.exports = {
    checkUserManager,
    insertPost,
    selectPostId,
    insertPost1,
    insertPost2,
    insertPost3,
    insertPost4,
    insertPost5,
    insertPost6,
    insertPost7,
    insertPost8,
    insertPost9,
    insertPost10,
    selectPostByPostId,
    selectJjim,
    addJjim,
    deleteJjim,
    updateJjim,
    selectJjimStatus,
    dataOrderByRecent,
    dataOrderByOld,
    dataOrderByScrab,
    dataOrderByCount,
    selectPostDetail,
    addWatchCount,
    selectJjimPost,
    updatePost,
    updatePost1,
    existPostByPostId,
    insertDeclaration,
    retrieveDeclarationCount,
    existDeclaration,
    deletePost,
    deletePostContent,
    searchPostUser,
    updateUserStatus,
    checkDeleteUser,
    selectCommentId,
    deleteReComment,
    deleteComment,

  };
  
  