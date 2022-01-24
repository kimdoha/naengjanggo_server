// 유통기한 임박한 상품 20개 조회
async function productDateLimit(connection, userId) {
    const selectListQuery = `
    SELECT DISTINCT P.productName
    FROM Product P
    WHERE P.userId = ${userId} AND status = 1
    ORDER BY P.date
    LIMIT 10;
    `;
    const [selectListRows] = await connection.query( selectListQuery, userId );
    return selectListRows;
  }

// 레시피가 존재하는지
async function existRecipe(connection, userId, keyword) {
    const selectListQuery = `
    SELECT *
    FROM Recipe
    WHERE userId = ? AND keyword = ?;
    `;
    const [selectListRows] = await connection.query( selectListQuery, [ userId, keyword ] );
    return selectListRows;
  }

// 레시피 추가 
async function insertRecipe(connection, userId, keyword, rcpNM, infoENG, infoCAR, infoPRO, infoFAT, infoNA, fileMain, ingredients) {
    const insertListQuery = `
    INSERT INTO Recipe(userId, keyword, rcpNM, infoENG, infoCAR, infoPRO, infoFAT, infoNA, fileMain, ingredients)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [insertListRows] = await connection.query(insertListQuery, [ userId, keyword, rcpNM, infoENG, infoCAR, infoPRO, infoFAT, infoNA, fileMain, ingredients ]);
    return insertListRows;
  }

// 레시피 수정 1
async function updateRecipe1(connection, userId, recipeId, manual1, manualImg1) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual1 = ? , manualImg1 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual1, manualImg1, userId, recipeId ]);
  return patchListRows;
}

// 레시피 수정 2
async function updateRecipe2(connection, userId, recipeId, manual2, manualImg2) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual2 = ? , manualImg2 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual2, manualImg2, userId, recipeId ]);
  return patchListRows;
}

// 레시피 수정 3
async function updateRecipe3(connection, userId, recipeId, manual3, manualImg3) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual3 = ? , manualImg3 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual3, manualImg3, userId, recipeId ]);
  return patchListRows;
}


// 레시피 수정 4
async function updateRecipe4(connection, userId, recipeId, manual4, manualImg4) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual4 = ? , manualImg4 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual4, manualImg4, userId, recipeId ]);
  return patchListRows;
}



// 레시피 수정 5
async function updateRecipe5(connection, userId, recipeId, manual5, manualImg5) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual5 = ? , manualImg5 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual5, manualImg5, userId, recipeId ]);
  return patchListRows;
}

// 레시피 수정 6
async function updateRecipe6(connection, userId, recipeId, manual6, manualImg6) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual6 = ? , manualImg6 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual6, manualImg6, userId, recipeId ]);
  return patchListRows;
}

// 레시피 수정 7
async function updateRecipe7(connection, userId, recipeId, manual7, manualImg7) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual7 = ? , manualImg7 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual7, manualImg7, userId, recipeId ]);
  return patchListRows;
}
 
// 레시피 수정 8
async function updateRecipe8(connection, userId, recipeId, manual8, manualImg8) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual8 = ? , manualImg8 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual8, manualImg8, userId, recipeId ]);
  return patchListRows;
}

// 레시피 수정 9
async function updateRecipe9(connection, userId, recipeId, manual9, manualImg9) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual9 = ? , manualImg9 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual9, manualImg9, userId, recipeId ]);
  return patchListRows;
}

// 레시피 수정 9
async function updateRecipe9(connection, userId, recipeId, manual9, manualImg9) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual9 = ? , manualImg9 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual9, manualImg9, userId, recipeId ]);
  return patchListRows;
}


// 레시피 수정 10
async function updateRecipe10(connection, userId, recipeId, manual10, manualImg10) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual10 = ? , manualImg10 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual10, manualImg10, userId, recipeId ]);
  return patchListRows;
}

// 레시피 수정 11
async function updateRecipe11(connection, userId, recipeId, manual11, manualImg11) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual11 = ? , manualImg11 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual11, manualImg11, userId, recipeId ]);
  return patchListRows;
}

// 레시피 수정 12
async function updateRecipe12(connection, userId, recipeId, manual12, manualImg12) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual12 = ? , manualImg12 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual12, manualImg12, userId, recipeId ]);
  return patchListRows;
}

// 레시피 수정 13
async function updateRecipe13(connection, userId, recipeId, manual13, manualImg13) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual13 = ? , manualImg13 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual13, manualImg13, userId, recipeId ]);
  return patchListRows;
}

// 레시피 수정 14
async function updateRecipe14(connection, userId, recipeId, manual14, manualImg14) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual14 = ? , manualImg14 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual14, manualImg14, userId, recipeId ]);
  return patchListRows;
}

// 레시피 수정 15
async function updateRecipe15(connection, userId, recipeId, manual15, manualImg15) {
  const patchListQuery = `
    UPDATE Recipe
    SET manual15 = ? , manualImg15 = ?
    WHERE userId = ? AND recipeId = ? 
    AND status = 1;
  `;
  const [patchListRows] = await connection.query(patchListQuery, [ manual15, manualImg15, userId, recipeId ]);
  return patchListRows;
}


// 레시피 조회 
async function selectRecipe(connection, userId, recipeId, page, size) {
  const selectListQuery = `
  SELECT recipeId, rcpNM, infoENG, fileMain,
         IFNULL((SELECT status
        FROM Scrab S
        WHERE userId = ${userId}
        AND recipeId = R.recipeId), 0) AS scrab
  FROM Recipe R
  WHERE userId = ?
    AND recipeId = ?
    AND status = 1
  ORDER BY R.createAt
  LIMIT ?, ?;
  `;
  const [selectListRows] = await connection.query( selectListQuery, [ userId, recipeId, page, size ] );
  return selectListRows;
}

// 레시피ID 조회
async function retrieveRecipeId(connection, userId, keyword) {
  const selectListQuery = `
  SELECT recipeId
  FROM Recipe
  WHERE userId = ?
    AND keyword = ? 
    AND status = 1;
  `;
  const [selectListRows] = await connection.query( selectListQuery, [ userId, keyword ] );
  return selectListRows;
}


// 레시피ID 유효한지
async function selectRecipeID(connection, userId, recipeId) {
  const selectListQuery = `
    SELECT *
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;
  `;
  const [selectListRows] = await connection.query( selectListQuery, [ userId, recipeId ] );
  return selectListRows;
}

// 스크랩 조회
async function selectScrab(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT EXISTS(
    SELECT *
    FROM Scrab
    WHERE userId = ? AND recipeId = ?)
    AS exist;
  `;
  const [selectListRows] = await connection.query( selectListQuery, [ userId, recipeId ] );
  return selectListRows;
}

async function addScrab(connection, userId, recipeId) {
  const insertListQuery = `
    INSERT INTO Scrab(userId, recipeId)
    VALUES (?, ?);
  `;
  const [insertListRows] = await connection.query(insertListQuery, [ userId, recipeId ]);
  return insertListRows;
}

async function selectScrabStatus(connection, userId, recipeId) {
  const selectListQuery = `
    SELECT status
    FROM Scrab
    WHERE userId = ? AND recipeId = ?;
  `;
  const [selectListRows] = await connection.query(selectListQuery , [ userId, recipeId ] );
  return selectListRows;
}

async function deleteScrab(connection, userId, recipeId) {
  const updateListQuery = `
    UPDATE Scrab
    SET status = 0
    WHERE userId = ? AND recipeId = ?;
  `;
  const [updateListRows] = await connection.query(updateListQuery, [ userId, recipeId ]);
  return updateListRows;
}

async function updateScrab(connection, userId, recipeId) {
  const updateListQuery = `
    UPDATE Scrab
    SET status = 1
    WHERE userId = ? AND recipeId = ?;
  `;
  const [updateListRows] = await connection.query(updateListQuery, [ userId, recipeId ]);
  return updateListRows;
}


//레시피 정보
async function retrieveRecipeInfo(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT recipeId, rcpNM, infoENG, fileMain,
         IFNULL((SELECT status
        FROM Scrab S
        WHERE userId = ${userId}
        AND recipeId = R.recipeId), 0) AS scrab,
         infoCAR, infoPRO, infoFAT, infoNA,
         REPLACE(REPLACE(REPLACE(ingredients, ',' , '\n'),':','\n'), ' ', '') AS ingredients,
         IFNULL(manual1, '') AS manual1, IFNULL(manualImg1 ,'') AS manualImg1,
         IFNULL(manual2, '') AS manual2, IFNULL(manualImg2, '') AS manualImg2,
         IFNULL(manual3, '') AS manual3, IFNULL(manualImg3, '') AS manualImg3,
         IFNULL(manual4, '') AS manual4, IFNULL(manualImg4, '') AS manualImg4,
         IFNULL(manual5, '') AS manual5, IFNULL(manualImg5, '') AS manualImg5,
         IFNULL(manual6, '') AS manual6, IFNULL(manualImg6, '') AS manualImg6,
         IFNULL(manual7, '') AS manual7, IFNULL(manualImg7, '') AS manualImg7,
         IFNULL(manual8, '') AS manual8, IFNULL(manualImg8, '') AS manualImg8,
         IFNULL(manual9, '') AS manual9, IFNULL(manualImg9, '') AS manualImg9,
         IFNULL(manual10, '') AS manual10, IFNULL(manualImg10, '') AS manualImg10,
         IFNULL(manual11, '') AS manual11, IFNULL(manualImg11, '') AS manualImg11,
         IFNULL(manual12, '') AS manual12, IFNULL(manualImg12, '') AS manualImg12,
         IFNULL(manual13, '') AS manual13, IFNULL(manualImg13, '') AS manualImg13,
         IFNULL(manual14, '') AS manual14, IFNULL(manualImg14, '') AS manualImg14,
         IFNULL(manual15, '') AS manual15, IFNULL(manualImg15, '') AS manualImg15

    FROM Recipe R
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual1(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual1, manualImg1
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual2(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual2, manualImg2
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual3(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual3, manualImg3
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual4(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual4, manualImg4
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual5(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual5, manualImg5
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual6(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual6, manualImg6
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual7(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual7, manualImg7
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual8(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual8, manualImg8
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual9(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual9, manualImg9
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual10(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual10, manualImg10
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual11(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual11, manualImg11
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual12(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual12, manualImg12
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual13(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual13, manualImg13
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual14(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual14, manualImg14
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

async function retrieveRecipeManual15(connection, userId, recipeId) {
  const selectListQuery = `
  SELECT manual15, manualImg15
    FROM Recipe
    WHERE userId = ?
    AND recipeId = ?
    AND status = 1;

  `;
  const [selectListRows] = await connection.query(selectListQuery, [ userId, recipeId ]);
  return selectListRows;
}

// 레시피 검색
async function retrieveRecipeProduct(connection, userId, product, page, size) {
  const selectListQuery = `
  SELECT recipeId, rcpNM, infoENG, fileMain,
         IFNULL((SELECT status
        FROM Scrab S
        WHERE userId = ${userId}
        AND recipeId = R.recipeId), 0) AS scrab
  FROM Recipe R
  WHERE userId = ?
    AND keyword = ?
    AND status = 1
  ORDER BY R.createAt
  LIMIT ?, ?;
  `;
  const [selectListRows] = await connection.query( selectListQuery, [ userId, product , page, size ] );
  return selectListRows;
}

// 레시피 찜 조회
async function retrieveJjimRecipe(connection, userId, page, size) {
  const selectListQuery = `
    SELECT R.recipeId, rcpNM, fileMain
    FROM Scrab S
    INNER JOIN Recipe R ON R.recipeId = S.recipeId
    WHERE S.userId = ?
    AND S.status = 1
    ORDER BY S.createAt DESC
    LIMIT ?, ?;  `;
  const [selectListRows] = await connection.query( selectListQuery, [ userId, page, size ] );
  return selectListRows;
}

  module.exports = {
    productDateLimit,
    existRecipe,
    insertRecipe,
    updateRecipe1,
    updateRecipe2,
    updateRecipe3,
    updateRecipe4,
    updateRecipe5,
    updateRecipe6,
    updateRecipe7,
    updateRecipe8,
    updateRecipe9,
    updateRecipe10,
    updateRecipe11,
    updateRecipe12,
    updateRecipe13,
    updateRecipe14,
    updateRecipe15,
    selectRecipe,
    retrieveRecipeId,
    selectRecipeID,
    selectScrab,
    addScrab,
    selectScrabStatus,
    deleteScrab,
    updateScrab,
    retrieveRecipeInfo,
    retrieveRecipeProduct,
    retrieveJjimRecipe,

    retrieveRecipeManual1,
    retrieveRecipeManual2,
    retrieveRecipeManual3,
    retrieveRecipeManual4,
    retrieveRecipeManual5,
    retrieveRecipeManual6,
    retrieveRecipeManual7,
    retrieveRecipeManual8,
    retrieveRecipeManual9,
    retrieveRecipeManual10,
    retrieveRecipeManual11,
    retrieveRecipeManual12,
    retrieveRecipeManual13,
    retrieveRecipeManual14,
    retrieveRecipeManual15,
  };
  
  