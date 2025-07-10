import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  deleteRecipeById,
  updateRecipeById,
  getRecipesByUserId,
} from "#db/queries/recipes";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

const router = express.Router();

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

router.route("/recipes/:id").delete(requireUser, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteRecipeById(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

router
  .route("/recipes/:id")
  .put(
    requireBody(["title", "ingredient_list", "instruction_list", "photo_id"]),
    requireUser,
    async (req, res) => {
      try {
        const { id } = req.params;
        const { title, ingredient_list, instruction_list, photo_id } = req.body;

        const updatedRecipe = await updateRecipeById(
          id,
          title,
          ingredient_list,
          instruction_list,
          photo_id
        );

        res.status(200).json(updatedRecipe);
      } catch (error) {
        res.status(500).json({ error: "Failed to update recipe" });
      }
    }
  );

router.route("/recipes/user/:user_id").get(async (req, res) => {
  try {
    const { user_id } = req.params;
    const recipes = await getRecipesByUserId(user_id);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user recipes" });
  }
});

export default router;
