import express from "express";
const router = express.Router();
export default router;

import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
} from "#db/queries/recipes";
import requireBody from "#middleware/requireBody";

router
  .route("/recipes")
  .post(
    requireBody([
      "title",
      "prep_time",
      "ingredient_list",
      "instruction_list",
      "photo_id",
      "creator_id",
    ]),
    async (req, res) => {
      try {
        const {
          title,
          prep_time: prepTime,
          ingredient_list: ingredientList,
          instruction_list: instructionList,
          photo_id: photoId,
          creator_id: creatorId,
        } = req.body;

        const recipe = await createRecipe(
          title,
          prepTime,
          ingredientList,
          instructionList,
          photoId,
          creatorId
        );

        res.status(201).json(recipe);
      } catch (error) {
        res.status(500).json({ error: "Failed to create recipe" });
      }
    }
  )
  .get(async (req, res) => {
    try {
      const recipes = await getAllRecipes();
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  });

router.route("/recipes/:id").get(async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await getRecipeById(id);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});
