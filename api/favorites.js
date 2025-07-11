import express from "express";
import {
  getAllFavoritedRecipes,
  addRecipeToFavorites,
  deleteRecipeFromFavorites,
  getTopFavoritedRecipes,
} from "#db/queries/favorites";

const router = express.Router();

router.get("/", async (request, response, next) => {
  try {
    const favorites = await getAllFavoritedRecipes();
    response.status(200).json(favorites);
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch favorites" });
  }
});

router.post("/:id", async (request, response, next) => {
  try {
    const recipeId = request.params.id;
    const { user_id } = request.body;
    if (!user_id) {
      return response.status(400).json({ error: "Missing user_id in body" });
    }
    const favorite = await addRecipeToFavorites(user_id, recipeId);
    response.status(201).json(favorite);
  } catch (error) {
    response.status(500).json({ error: "Failed to add favorite" });
  }
});

router.delete("/:id", async (request, response, next) => {
  try {
    const recipeId = request.params.id;
    const { user_id } = request.body;
    if (!user_id) {
      return response.status(400).json({ error: "Missing user_id in body" });
    }
    const deleted = await deleteRecipeFromFavorites(user_id, recipeId);
    if (!deleted) {
      return response.status(404).json({ error: "Favorite not found" });
    }
    response.json({ message: "Favorite deleted", deleted });
  } catch (error) {
    response.status(500).json({ error: "Failed to delete favorite" });
  }
});

router.get("/top-favorited", async (request, response, next) => {
  try {
    const limit = parseInt(request.query.limit) || 9;
    const topRecipes = await getTopFavoritedRecipes(limit);
    response.status(200).json(topRecipes);
  } catch (error) {
    response
      .status(500)
      .json({ error: "Failed to fetch top favorited recipes" });
  }
});

export default router;
