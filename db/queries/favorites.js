import db from "#db/client.js";


export const getAllFavoritedRecipes = async () => {
  const { rows } = await db.query(
    `
    SELECT
      favorited_recipes.id,
      favorited_recipes.user_id,
      favorited_recipes.recipe_id,
      recipe.title,
      recipe.prep_time,
      users.username,
      photos.img_url
    FROM favorited_recipes
    JOIN recipe ON favorited_recipes.recipe_id = recipe.id
    JOIN users ON favorited_recipes.user_id = users.id
    LEFT JOIN photos ON recipe.photo_id = photos.id
    `
  );
  return rows;
};

export const addRecipeToFavorites = async (userId, recipeId) => {
  const { rows: [favorite] } = await db.query(
    `
    INSERT INTO favorited_recipes(user_id, recipe_id)
    VALUES ($1, $2)
    RETURNING *
    `,
    [userId, recipeId]
  );
  return favorite;
};

export const deleteRecipeFromFavorites = async (userId, recipeId) => {
  const { rows: [deleted] } = await db.query(
    `
    DELETE FROM favorited_recipes
    WHERE user_id = $1 AND recipe_id = $2
    RETURNING *
    `,
    [userId, recipeId]
  );
  return deleted;
};