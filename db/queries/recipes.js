import db from "#db/client";

export async function createRecipe(
  title,
  prepTime,
  ingredientList,
  instructionList,
  photoId,
  creatorId
) {
  const sql = `
    INSERT INTO recipe
      (title, prep_time, ingredient_list, instruction_list, photo_id, creator_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const {
    rows: [recipe],
  } = await db.query(sql, [
    title,
    prepTime,
    ingredientList,
    instructionList,
    photoId,
    creatorId,
  ]);
  return recipe;
}

export async function getAllRecipes() {
  const sql = `
    SELECT 
      recipe.id,
      recipe.title, 
      recipe.prep_time, 
      recipe.photo_id, 
      users.username,
      photos.img_url
    FROM recipe
    JOIN users ON recipe.creator_id = users.id
    LEFT JOIN photos ON recipe.photo_id = photos.id
  `;

  const { rows: allRecipes } = await db.query(sql);
  return allRecipes;
}

export async function getRecipeById(id) {
  const sql = `
    SELECT 
      recipe.id,
      recipe.title, 
      recipe.prep_time, 
      recipe.ingredient_list, 
      recipe.instruction_list, 
      recipe.photo_id, 
      users.username,
      photos.img_url
    FROM recipe
    JOIN users ON recipe.creator_id = users.id
    LEFT JOIN photos ON recipe.photo_id = photos.id
    WHERE recipe.id = $1
  `;

  const {
    rows: [wholeRecipe],
  } = await db.query(sql, [id]);
  return wholeRecipe;
}

export async function deleteRecipeById(id) {
  const sql = `
  DELETE FROM recipe
  WHERE id = $1
  `;
  await db.query(sql, [id]);
}

export async function updateRecipeById(
  id,
  title,
  ingredient_list,
  instruction_list,
  photo_id
) {
  const sql = `
    UPDATE recipe SET 
    title = $2,
    ingredient_list = $3,
    instruction_list = $4,
    photo_id = $5 
    WHERE id = $1
    RETURNING *
   `;
  const {
    rows: [recipe],
  } = await db.query(sql, [
    id,
    title,
    ingredient_list,
    instruction_list,
    photo_id,
  ]);
  return recipe;
}

export async function getRecipesByUserId(user_id) {
  const sql = `
    SELECT 
      recipe.id,
      recipe.title, 
      recipe.prep_time, 
      recipe.ingredient_list,
      recipe.instruction_list,
      recipe.photo_id, 
      users.username,
      photos.img_url
    FROM recipe
    JOIN users ON recipe.creator_id = users.id
    LEFT JOIN photos ON recipe.photo_id = photos.id
    WHERE recipe.creator_id = $1
  `;
  const { rows } = await db.query(sql, [user_id]);
  return rows;
}
