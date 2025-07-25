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
  try {
    const existingCheck = await db.query(
      `SELECT * FROM favorited_recipes WHERE user_id = $1 AND recipe_id = $2`,
      [userId, recipeId]
    );

    if (existingCheck.rows.length > 0) {
      return existingCheck.rows[0];
    }

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
  } catch (error) {
    console.error("Database error in addRecipeToFavorites:", error);
    throw error;
  }
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
      recipe.title,
      users.username,
      COUNT(favorited_recipes.recipe_id) AS favoriteCount,
      photos.img_url
    FROM recipe
    JOIN favorited_recipes ON recipe.id = favorited_recipes.recipe_id
    JOIN users ON recipe.creator_id = users.id
    LEFT JOIN photos ON photos.recipe_id = recipe.id
    GROUP BY recipe.id, recipe.title, users.username, photos.img_url
    ORDER BY favoriteCount DESC
    LIMIT $1
    `,
    [limit]
  );
  return rows;
};

export const getUserFavorites = async (userId) => {
  const { rows } = await db.query(
    `SELECT 
      recipe.id,
      recipe.title,
      recipe.prep_time,
      recipe.ingredient_list as ingredients,
      recipe.instruction_list as instructions,
      recipe.creator_id,
      users.username,
      photos.img_url,
      favorited_recipes.recipe_id,
      COUNT(all_favorites.recipe_id) as favoritecount
     FROM favorited_recipes 
     JOIN recipe ON favorited_recipes.recipe_id = recipe.id 
     JOIN users ON recipe.creator_id = users.id
     LEFT JOIN photos ON photos.recipe_id = recipe.id
     LEFT JOIN favorited_recipes as all_favorites ON all_favorites.recipe_id = recipe.id
     WHERE favorited_recipes.user_id = $1
     GROUP BY recipe.id, recipe.title, recipe.prep_time, recipe.ingredient_list, recipe.instruction_list, recipe.creator_id, users.username, photos.img_url, favorited_recipes.recipe_id`,
    [userId]
  );
  return rows;
};
