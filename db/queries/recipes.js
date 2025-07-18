import db from "#db/client";

export async function createRecipe(
  title,
  prepTime,
  ingredientList,
  instructionList,
  creatorId
) {
  const sql = `
    INSERT INTO recipe
      (title, prep_time, ingredient_list, instruction_list, creator_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const {
    rows: [recipe],
  } = await db.query(sql, [
    title,
    prepTime,
    ingredientList,
    instructionList,
    creatorId,
  ]);
  return recipe;
}

export async function getAllRecipes() {
  const sql = `
    SELECT * FROM recipe
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
      users.username,
      photos.img_url,
      photos.recipe_id
    FROM recipe
    JOIN users ON recipe.creator_id = users.id
    LEFT JOIN photos ON photos.recipe_id = recipe.id
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
  prepTime,
  ingredient_list,
  instruction_list
) {
  const sql = `
    UPDATE recipe SET 
    title = $2,
    prep_time = $3,
    ingredient_list = $4,
    instruction_list = $5
    WHERE id = $1
    RETURNING *
   `;
  const {
    rows: [recipe],
  } = await db.query(sql, [
    id,
    title,
    prepTime,
    ingredient_list,
    instruction_list,
  ]);
  return recipe;
}

export async function getRecipesByUserId(user_id) {
  console.log(user_id);
  const sql = `
    SELECT 
      recipe.id,
      recipe.title, 
      recipe.prep_time, 
      recipe.ingredient_list,
      recipe.instruction_list,
      photos.recipe_id, 
      users.username,
      photos.img_url
    FROM recipe
    JOIN users ON recipe.creator_id = users.id
    LEFT JOIN photos ON photos.recipe_id = recipe.id
    WHERE recipe.creator_id = $1;
  `;
  const { rows } = await db.query(sql, [user_id]);
  return rows;
}

export async function getRandomRecipes(limit = 9) {
  const sql = `
    SELECT 
      recipe.id,
      recipe.title,
      recipe.prep_time, 
      photos.recipe_id, 
      users.username,
      photos.img_url
    FROM recipe
    JOIN users ON recipe.creator_id = users.id
    LEFT JOIN photos ON photos.recipe_id = recipe.id
    ORDER BY RANDOM()
    LIMIT $1
  `;
  const { rows } = await db.query(sql, [limit]);
  return rows;
}

export async function getRecipeWithPhotosById(id) {
  try {
    const recipe = await db.query("SELECT * FROM recipe WHERE id = $1", [id]);
    if (!recipe) {
      console.log("Recipe not found for ID:", id);
      return null;
    }

    const photos = await db.query(
      "SELECT img_url FROM photos WHERE recipe_id = $1",
      [id]
    );
    return { ...recipe, photos };
  } catch (error) {
    console.error("Error in getRecipeWithPhotosById:", error);
    throw error;
  }
}
