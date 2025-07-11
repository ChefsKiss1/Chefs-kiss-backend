import db from "#db/client";

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
    LEFT JOIN photos ON photos.recipe_id = recipe.id
    `
  );
  return rows;
};

export const addRecipeToFavorites = async (userId, recipeId) => {
  const {
    rows: [favorite],
  } = await db.query(
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
  const {
    rows: [deleted],
  } = await db.query(
    `
    DELETE FROM favorited_recipes
    WHERE user_id = $1 AND recipe_id = $2
    RETURNING *
    `,
    [userId, recipeId]
  );
  return deleted;
};


export const getTopFavoritedRecipes = async (limit = 9) => {
  const { rows } = await db.query(
    `
    SELECT
      recipe.id,
      recipe.title AS name,
      users.username,
      COUNT(favorited_recipes.recipe_id) AS favoriteCount,
      photos.img_url
    FROM recipe
    JOIN favorited_recipes ON recipe.id = favorited_recipes.recipe_id
    JOIN users ON recipe.user_id = users.id
    LEFT JOIN photos ON recipe.photo_id = photos.id
    GROUP BY recipe.id, recipe.title, users.username, photos.img_url
    ORDER BY favoriteCount DESC
    LIMIT $1
    `,
    [limit]
  );
  return rows;
};

