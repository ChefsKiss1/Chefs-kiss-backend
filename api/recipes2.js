import express from "express";
const router = express.Router();
export default router;
import {
  getRecipes,
  getRecipeById,
  deleteRecipeById,
  createRecipe,
  updateRecipeById,
} from "#db/queries/recipes";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

router.route("/recipes").get(async (req, res) => {
  const recipes = await getRecipes();
  res.send(recipes);
});
// router.use(requireUser);
router
  .route("/")
  .post(
    requireUser,
    requireBody(["title", "ingredient_list", "instruction_list", "photo_id"]),
    async (req, res) => {
      const { title, ingredient_list, instruction_list, photo_id } = req.body;
      const createRecipe = await createRecipe(
        title,
        ingredient_list,
        instruction_list,
        photo_id
      );
      res.status(201).send(createRecipe);
    }
  );

router.route("/:id").delete(async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.id;

  const recipe = await getRecipeById(recipeId);
  if (!recipe) {
    return res.sendStatus(404);
  }
  if (recipe.user_id !== userId) {
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
      if (recipe.user_id !== req.user.id) {
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
