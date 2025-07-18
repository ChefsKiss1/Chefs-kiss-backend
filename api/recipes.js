import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeWithPhotosById,
  deleteRecipeById,
  updateRecipeById,
  getRecipesByUserId,
  getRandomRecipes,
} from "#db/queries/recipes";
import { createPhoto } from "#db/queries/photos";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

const router = express.Router();
router.use(express.json());
router
  .route("/")
  .get(async (req, res) => {
    try {
      const recipes = await getAllRecipes();
      console.log(recipes);
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  })

  .post(
    requireBody(["title", "prepTime", "ingredientList", "instructionList"]),
    async (req, res, next) => {
      try {
        const { title, prepTime, ingredientList, instructionList, imageUrl } =
          req.body;
        const creatorId = req.user.id;
        const recipe = await createRecipe(
          title,
          prepTime,
          ingredientList,
          instructionList,
          creatorId
        );

        if (imageUrl) {
          await createPhoto(recipe.id, imageUrl);
        }

        res.status(201).json(recipe);
      } catch (error) {
        console.error(error);
        next(error);
      }
    }
  );

router.get("/random", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const randomRecipes = await getRandomRecipes(limit);
    res.json(randomRecipes);
  } catch (error) {
    console.error("Error fetching random recipes:", error);
    res.status(500).json({ error: "Failed to fetch random recipes" });
  }
});

router.route("/user").get(requireUser, async (req, res) => {
  try {
    const recipes = await getRecipesByUserId(req.user.id);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user recipes" });
  }
});
router.route("/:id").get(async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await getRecipeWithPhotosById(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

router.route("/:id").delete(requireUser, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteRecipeById(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

router
  .route("/:id")
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

export default router;
