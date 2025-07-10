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

router.route("/:id").delete(requireUser, async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.id;

  const recipe = await getRecipeById(recipeId);
  if (!recipe) {
    return res.sendStatus(404);
  }
  if (recipe.creator_id !== userId) {
    return res.sendStatus(403);
  }

  await deleteRecipeById(recipeId);
  res.sendStatus(204);
});
router
  .route("/:id")
  .put(
    requireUser,
    requireBody(["title", "ingredient_list", "instruction_list", "photo_id"]),
    async (req, res) => {
      const { title, ingredient_list, instruction_list, photo_id } = req.body;
      const recipeId = req.params.id;

      const recipe = await getRecipeById(recipeId);
      if (!recipe) {
        return res.sendStatus(404);
      }
      if (recipe.creator_id !== req.user.id) {
        return res.sendStatus(403);
      }

      const updatedRecipe = await updateRecipeById(
        recipeId,
        title,
        ingredient_list,
        instruction_list,
        photo_id
      );
      res.send(updatedRecipe);
    }
  );

router.route("/my-recipes").get(requireUser, async (req, res) => {
  const user_id = req.user.id;
  const recipes = await getRecipesByUserId(user_id);
  res.status(200).json(recipes);
});

export default router;
