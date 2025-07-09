import express from "express";
import { getAllFavoritedRecipes, 
         addRecipeToFavorites, 
         deleteRecipeFromFavorites } from "#db/queries/favorites.js";

const router = express.Router();

router
  .get("/recipes/favorites", async (request, response, next) => {
    const favorites = await getAllFavoritedRecipes();
    
    response.send(favorites);
});

router
  .post("/recipes/favorites/:id", async (request, response, next) => {
    const recipeId = request.params.id;
    const { user_id } = request.body;

    if (!user_id) {
      return response.status(400).send({ error: "Missing user_id in body" });
  }
    const favorite = await addRecipeToFavorites(user_id, recipeId);

    response.status(201).send(favorite);
});

router
  .delete("/recipes/favorites/:id", async (request, response, next) => {
    const recipeId = request.params.id;
    const { user_id } = request.body;

    if (!user_id) {
      return response.status(400).send({ error: "Missing user_id in body" });
  }
    const deleted = await deleteRecipeFromFavorites(user_id, recipeId);

    if (!deleted) {
      return response.status(404).send({ error: "Favorite not found" });
  }

    response.send({ message: "Favorite deleted", deleted });
});

export default router