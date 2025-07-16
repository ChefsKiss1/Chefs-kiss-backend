import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import {
  getAllFavoritedRecipes,
  addRecipeToFavorites,
  deleteRecipeFromFavorites,
  getTopFavoritedRecipes,
  getUserFavorites,
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

router.route("/user").get(async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json([]);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.json([]);
    }

    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      const userId = payload.id;

      if (!userId) {
        return res.json([]);
      }

      const favorites = await getUserFavorites(userId);
      res.json(favorites);
    } catch (tokenError) {
      console.error("Token decode error:", tokenError);
      return res.json([]);
    }
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    res.json([]);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const { recipe_id, user_id } = request.body;
    if (!user_id || !recipe_id) {
      return response
        .status(400)
        .json({ error: "Missing user_id or recipe_id" });
    }
    const favorite = await addRecipeToFavorites(user_id, recipe_id);
    response.status(201).json(favorite);
  } catch (error) {
    console.error("Error adding to favorites:", error);
    response.status(500).json({ error: "Failed to add favorite" });
  }
});

router.delete("/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    const { user_id } = request.body;

    if (!user_id || !id) {
      return response
        .status(400)
        .json({ error: "Missing user_id or recipe_id" });
    }

    const result = await deleteRecipeFromFavorites(user_id, id);
    response.status(200).json(result);
  } catch (error) {
    console.error("Error removing from favorites:", error);
    response.status(500).json({ error: "Failed to remove favorite" });
  }
});

router.get("/top-favorited", async (request, response, next) => {
  try {
    const topFavorites = await getTopFavoritedRecipes();
    response.status(200).json(topFavorites);
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch top favorites" });
  }
});

export default router;
