import db from "#db/client";

export async function getRecipes() {
  const sql = `
  SELECT * FROM recipes
  `;
  const {
    rows: [recipes],
  } = await db.query(sql);
  return recipes;
}

export async function createRecipe(
  user_id,
  title,
  ingredient_list,
  instruction_list,
  photo_id
) {
  const sql = `
    INSERT INTO recipes (creator_id,title, ingredient_list, instruction_list, photo_id)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    
    `;
  const {
    rows: [createdRecipe],
  } = await db.query(sql, [
    user_id,
    title,
    ingredient_list,
    instruction_list,
    photo_id,
  ]);
  return createdRecipe;
}

export async function getRecipeById(id) {
  const sql = `
    SELECT * FROM tasks WHERE id =$1
    
    `;
  const {
    rows: [recipe],
  } = await db.query(sql, [id]);

  return recipe;
}

export async function deleteRecipeById(id) {
  const sql = `
  DELETE recipes
  WHERE id = $1
  `;
  await db.query(sql, [id]);
}
export async function updateRecipeById(
  title,
  ingredient_list,
  instruction_list,
  photo_id
) {
  const sql = `
    UPDATE tasks SET title= $2,
    ingredient_list =$3,
    instruction_list =$4,
    photo_id= $5 WHERE 
    creator_id=$1
    RETURNING *
   `;
  const {
    rows: [recipe],
  } = await db.query(sql, [title, ingredient_list, instruction_list, photo_id]);
}
