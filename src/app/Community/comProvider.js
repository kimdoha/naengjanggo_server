const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const comDao = require("./comDao");


exports.checkUserManager = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const managerResult = await comDao.checkUserManager(connection, userId);
  connection.release();

  return managerResult;
};

exports.selectPostId = async function (userId, userId, title, category) {
  const connection = await pool.getConnection(async (conn) => conn);
  const postResult = await comDao.selectPostId(connection, userId, title, category);
  console.log(postResult);
  connection.release();

  return postResult[0];
};

// [꿀팁공유] 전체 화면 조회 API
exports.selectPTipShare = async function (userId, category, type, page, size) {
    const connection = await pool.getConnection(async (conn) => conn);
    var dateResult;

    if(type == '최신순'){
        dateResult = await comDao.dataOrderByRecent(connection, category, userId, page, size);
    } else if(type == '조회순'){
        dateResult = await comDao.dataOrderByCount(connection, category, userId, page, size);
    } else if(type == '과거순'){
        dateResult = await comDao.dataOrderByOld(connection, category, userId, page, size);
    } else if(type == '좋아요순'){
        dateResult = await comDao.dataOrderByScrab(connection, category, userId, page, size);
    }

    connection.release();

    return dateResult;
  };

// 해당 category에 postId가 유효한지
exports.selectPostByPostId = async function (category, postId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const postResult = await comDao.selectPostByPostId(connection, category, postId);
  connection.release();

  return postResult;
};

// userId의 postId 조회
exports.selectJjim = async function (userId, postId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const postResult = await comDao.selectJjim(connection, userId, postId);
  connection.release();

  return postResult;
};

exports.selectJjimStatus = async function (userId, postId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const postResult = await comDao.selectJjimStatus(connection, userId, postId);
  connection.release();

  return postResult;
};

// 게시글 세부 조회
exports.selectPostDetail = async function (category, userId, postId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const postResult = await comDao.selectPostDetail(connection, userId, category, postId);
  connection.release();

  return postResult;
};

// 찜 - 커뮤니티 글 조회
exports.selectJjimPost = async function (userId, page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const postResult = await comDao.selectJjimPost(connection, userId, page, size);
  connection.release();

  return postResult;
};

// Post가 존재하는지
exports.existPostByPostId = async function (postId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const postResult = await comDao.existPostByPostId(connection, postId);
  connection.release();

  return postResult;
};

// 내가 신고 했는지
exports.existDeclaration = async function (userId, postId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const declarResult = await comDao.existDeclaration(connection, userId, postId);
  connection.release();

  return declarResult[0];
};

// commentId 들 추출
exports.selectCommentId = async function (postId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const commentResult = await comDao.selectCommentId(connection, postId);
  connection.release();

  return commentResult;
};

// 내가 쓴 postId인지
exports.checkDeleteUser = async function (userId, postId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const commentResult = await comDao.checkDeleteUser(connection, userId, postId);
  connection.release();

  return commentResult;
};