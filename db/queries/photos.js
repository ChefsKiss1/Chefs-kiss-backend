import db from "#db/client";

export async function createPhoto(recipe_id, url) {
  const sql = `
  INSERT INTO photos
    (recipe_id, url)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  const {
    rows: [photo],
  } = await db.query(sql, [recipe_id, url]);
  return photo;
}

export async function fetchPhotosByRecipeId(recipe_id) {
  const sql = `
  SELECT *
  FROM photos
  WHERE recipe_id= $1
  `;
  const { rows } = await db.query(sql, [recipe_id]);

  return rows;
}

export async function deletePhoto(photo_id) {
  const sql = `
  DELETE 
  FROM photos
  WHERE id = $1
   RETURNING *
  `;
  const {
    rows: [photo],
  } = await db.query(sql, [photo_id]);
  return photo;
}
