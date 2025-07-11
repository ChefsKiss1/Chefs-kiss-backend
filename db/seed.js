import db from "#db/client";
import { createUser } from "#db/queries/users";
import { addRecipeToFavorites } from "./queries/favorites.js";
import { createPhoto } from "./queries/photos.js";
import { createRecipe } from "./queries/recipes.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const test1 = await createUser("foo", "email@email.com", "bar");

  const recipe1 = await createRecipe(
    "test recipe",
    3,
    "eggs, bacon, milk",
    "whisk eggs and milk. cook bacon at 400 degrees in your oven. cook the eggs in a pan on medium high heat on your stove top.",
    test1.id
  );

  await createPhoto(
    recipe1.id,
    "https://www.dishbydish.net/wp-content/uploads/Air-Fryer-Bacon-Gluten-Free-Dairy-Free_Final3-scaled.webp"
  );

  await addRecipeToFavorites(test1.id, recipe1.id);
}
