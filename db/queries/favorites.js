import db from "#db/client.js";


export const getAllFavoritedRecipes = async () => {
  const { rows } = await db.query(
    `
    SELECT favorited_recipes.*, recipe.title, recipe.photo
    FROM favorited_recipes
    JOIN recipe ON favorited_recipes.recipe_id = recipe.id
  `);

  return rows;
};

export const addRecipeToFavorites = async (userId, recipeId) => {
  const { rows: [favorite] } = await db.query(
    `
    INSERT INTO favorited_recipes(user_id, recipe_id)
    VALUES ($1, $2)
    RETURNING *
    `,
    [userId, recipeId]);

  return favorite;
};

export const deleteRecipeFromFavorites = async (userId, recipeId) => {
  const { rows: [deleted] } = await db.query(
    `
    DELETE FROM favorited_recipes
    WHERE user_id = $1 AND recipe_id = $2
    RETURNING *
  `, 
  [userId, recipeId]);

  return deleted;
};