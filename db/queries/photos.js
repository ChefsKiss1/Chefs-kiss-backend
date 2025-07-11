import db from "#db/client";

export async function createPhoto(recipeId, url) {
  const sql = `
  INSERT INTO photos
    (recipe_id, img_url)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  const {
    rows: [photo],
  } = await db.query(sql, [recipeId, url]);
  return photo;
}

export async function fetchPhotosByRecipeId(recipeId) {
  const sql = `
  SELECT *
  FROM photos
  WHERE recipe_id= $1
  `;
  const { rows } = await db.query(sql, [recipeId]);

  return rows;
}

export async function deletePhoto(recipeId) {
  const sql = `
  DELETE 
  FROM photos
  WHERE id = $1
   RETURNING *
  `;
  const {
    rows: [photo],
  } = await db.query(sql, [recipeId]);
  return photo;
}
