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
  .route("/")
  .post(
    requireBody(["title", "prepTime", "ingredientList", "instructionList"]),
    async (req, res) => {
      try {
        const { title, prepTime, ingredientList, instructionList } = req.body;
        const creatorId = req.user.id;
        const recipe = await createRecipe(
          title,
          prepTime,
          ingredientList,
          instructionList,
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
    requireBody(["title", "ingredient_list", "instruction_list"]),
    requireUser,
    async (req, res) => {
      try {
        const { id } = req.params;
        const { title, ingredient_list, instruction_list } = req.body;

        const updatedRecipe = await updateRecipeById(
          id,
          title,
          ingredient_list,
          instruction_list
        );

        res.status(200).json(updatedRecipe);
      } catch (error) {
        res.status(500).json({ error: "Failed to update recipe" });
      }
    }
  );

router.route("/user").get(requireUser, async (req, res) => {
  try {
    console.log(req.user);
    //const { id } = req.user;
    const recipes = await getRecipesByUserId(req.user.id);
    console.log(recipes);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user recipes" });
  }
});

export default router;
