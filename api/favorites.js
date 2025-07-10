import express from "express";
import { getAllFavoritedRecipes,
         addRecipeToFavorites,
         deleteRecipeFromFavorites } from "#db/queries/favorites.js";

const router = express.Router();

router
  .get("/recipes/favorites", async (request, response, next) => {
    try {
      const favorites = await getAllFavoritedRecipes();
      response.status(200).json(favorites);
    } catch (error) {
      response.status(500).json({ error: "Failed to fetch favorites" });
    }
  });
router
  .post("/recipes/favorites/:id", async (request, response, next) => {
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
router
  .delete("/recipes/favorites/:id", async (request, response, next) => {
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
export default router;
