const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const cmtDao = require("./cmtDao");

exports.selectCommentInPost = async function (postId, commentId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const cmtResult = await cmtDao.selectCommentInPost(connection, postId, commentId);
  connection.release();

  return cmtResult;
};
// 댓글 조회
exports.selectComment = async function (postId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const cmtResult = await cmtDao.selectComment(connection, postId);
  connection.release();

  return cmtResult;
};

// 대댓글 조회
exports.selectReComment = async function (commentId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const cmtResult = await cmtDao.selectReComment(connection, commentId);
  connection.release();

  return cmtResult;
};

// 댓글에 대댓글이 존재하는지
exports.selectCommentsInComment = async function (commentId, commentsId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const cmtResult = await cmtDao.selectCommentsInComment(connection, commentId, commentsId);
  connection.release();

  return cmtResult;
};

  // 포스트 정보 반환
  exports.retrievePostInfo = async function (postId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const dateResult = await cmtDao.retrievePostInfo(connection, postId);
    connection.release();

    return dateResult;
  };

// 포스트 정보 반환
  exports.retrievePostInfo = async function (postId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const dateResult = await cmtDao.retrievePostInfo(connection, postId);
    connection.release();

    return dateResult;
  };