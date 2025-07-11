import express from "express";
import {
  createPhoto,
  deletePhoto,
  fetchPhotosByRecipeId,
} from "#db/queries/photos";
import requireBody from "#middleware/requireBody";

const router = express.Router();

router
  .route("/photos/:recipe_id")
  .post(requireBody(["url"]), async (req, res) => {
    const { recipe_id, url } = req.body;
    const photo = await createPhoto(recipe_id, url);
    if (!photo) return res.status(404).send("Invalid photo url.");
    res.status(201).json(photo);
  });

router.route("/photos/:recipe_id").get(async (req, res) => {
  const { recipe_id } = req.params;
  const photos = await fetchPhotosByRecipeId(recipe_id);
  if (!photos) return res.status(404).send("Invalid photo url or recipe id.");
  res.status(200).json(photos);
});

router
  .route("/photos/:recipe_id")
  .delete(requireBody(["url"]), async (req, res) => {
    const { recipe_id, url } = req.params;
    const photo = await deletePhoto(recipe_id, url);
    if (!photo) return res.status(404).send("Bad Request");
    res.status(200).json({ message: "Photo deleted successfully" });
  });

export default router;
