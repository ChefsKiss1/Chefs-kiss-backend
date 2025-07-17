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
  // Create 5 users
  const users = [];
  const userNames = ["Alice", "Bob", "Charlie", "Diana", "Emma"];

  for (let i = 0; i < userNames.length; i++) {
    const user = await createUser(
      userNames[i].toLowerCase(),
      `${userNames[i].toLowerCase()}@email.com`,
      "password123"
    );
    users.push(user);
  }

  // Recipe data
  const recipeData = [
    {
      name: "Classic Pancakes",
      servings: 4,
      ingredients: "flour, eggs, milk, sugar, baking powder",
      instructions:
        "Mix dry ingredients. Whisk wet ingredients separately. Combine and cook on griddle.",
      photo:
        "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=2070&auto=format&f[…]0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Chicken Stir Fry",
      servings: 2,
      ingredients: "chicken breast, soy sauce, vegetables, garlic, ginger",
      instructions:
        "Cut chicken into strips. Heat oil in wok. Cook chicken first, then vegetables. Add sauce.",
      photo: "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
    },
    {
      name: "Chocolate Chip Cookies",
      servings: 12,
      ingredients: "flour, butter, sugar, chocolate chips, eggs",
      instructions:
        "Cream butter and sugar. Add eggs. Mix in dry ingredients and chips. Bake at 375°F.",
      photo: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
    },
    {
      name: "Caesar Salad",
      servings: 3,
      ingredients: "romaine lettuce, parmesan, croutons, caesar dressing",
      instructions:
        "Chop lettuce. Toss with dressing. Top with cheese and croutons.",
      photo: "https://images.unsplash.com/photo-1551248429-40975aa4de74",
    },
    {
      name: "Beef Tacos",
      servings: 4,
      ingredients: "ground beef, taco shells, cheese, lettuce, tomatoes",
      instructions:
        "Brown beef with seasonings. Warm shells. Fill with beef and toppings.",
      photo: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b",
    },
    {
      name: "Mushroom Risotto",
      servings: 3,
      ingredients:
        "arborio rice, mushrooms, chicken stock, white wine, parmesan",
      instructions:
        "Sauté mushrooms. Toast rice. Add stock gradually while stirring. Finish with cheese.",
      photo: "https://images.unsplash.com/photo-1476124369491-e7addf5db371",
    },
    {
      name: "Banana Bread",
      servings: 8,
      ingredients: "bananas, flour, sugar, eggs, butter, baking soda",
      instructions:
        "Mash bananas. Cream butter and sugar. Add eggs and bananas. Mix in dry ingredients.",
      photo: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df",
    },
    {
      name: "Grilled Salmon",
      servings: 2,
      ingredients: "salmon fillets, lemon, olive oil, herbs, salt, pepper",
      instructions:
        "Season salmon. Preheat grill. Cook 4-5 minutes per side. Serve with lemon.",
      photo: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
    },
    {
      name: "Vegetable Soup",
      servings: 6,
      ingredients: "mixed vegetables, vegetable broth, onion, garlic, herbs",
      instructions:
        "Sauté onion and garlic. Add vegetables and broth. Simmer until tender.",
      photo: "https://images.unsplash.com/photo-1547592166-23ac45744acd",
    },
    {
      name: "Pizza Margherita",
      servings: 4,
      ingredients: "pizza dough, tomato sauce, mozzarella, basil, olive oil",
      instructions:
        "Roll out dough. Spread sauce. Add cheese and basil. Bake at 500°F.",
      photo: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    },
    {
      name: "French Toast",
      servings: 3,
      ingredients: "bread, eggs, milk, cinnamon, vanilla, butter",
      instructions:
        "Whisk eggs, milk, and spices. Dip bread. Cook in buttered pan until golden.",
      photo: "https://images.unsplash.com/photo-1484723091739-30a097e8f929",
    },
    {
      name: "Chicken Curry",
      servings: 4,
      ingredients: "chicken, curry powder, coconut milk, onion, garlic, ginger",
      instructions:
        "Sauté aromatics. Add chicken and spices. Pour in coconut milk. Simmer until tender.",
      photo: "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
    },
    {
      name: "Apple Pie",
      servings: 8,
      ingredients: "apples, pie crust, sugar, cinnamon, flour, butter",
      instructions:
        "Slice apples. Mix with sugar and spices. Fill crust. Top and bake at 425°F.",
      photo: "https://images.unsplash.com/photo-1535920527002-b35e96722bd4",
    },
    {
      name: "Spaghetti Carbonara",
      servings: 2,
      ingredients: "spaghetti, eggs, bacon, parmesan, black pepper",
      instructions:
        "Cook pasta. Fry bacon. Mix eggs and cheese. Toss hot pasta with egg mixture.",
      photo: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5",
    },
    {
      name: "Greek Salad",
      servings: 4,
      ingredients:
        "cucumber, tomatoes, olives, feta cheese, olive oil, oregano",
      instructions:
        "Chop vegetables. Combine in bowl. Add olives and feta. Dress with oil and oregano.",
      photo: "https://images.unsplash.com/photo-1540420773420-3366772f4999",
    },
    {
      name: "Beef Stew",
      servings: 6,
      ingredients: "beef chuck, potatoes, carrots, onion, beef broth, herbs",
      instructions:
        "Brown beef. Sauté vegetables. Add broth and herbs. Simmer 2 hours until tender.",
      photo:
        "https://images.unsplash.com/photo-1608500219063-e5164085cd6f?q=80&w=987&auto=format&fi[…]0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Lemon Bars",
      servings: 12,
      ingredients: "flour, butter, sugar, eggs, lemons, powdered sugar",
      instructions:
        "Make shortbread crust. Bake. Pour lemon filling over. Bake again. Dust with sugar.",
      photo:
        "https://assets.bonappetit.com/photos/65315b419597ee4cce04947f/1:1/w_1920,c_limit/20231002-1223-FOB-1440.jpg",
    },
    {
      name: "Fish and Chips",
      servings: 4,
      ingredients: "white fish, potatoes, flour, beer, oil for frying",
      instructions:
        "Cut potatoes. Make beer batter. Fry chips first, then battered fish until golden.",
      photo: "https://images.unsplash.com/photo-1544982503-9f984c14501a",
    },
    {
      name: "Caprese Salad",
      servings: 2,
      ingredients: "tomatoes, mozzarella, basil, balsamic vinegar, olive oil",
      instructions:
        "Slice tomatoes and mozzarella. Arrange with basil. Drizzle with oil and vinegar.",
      photo: "https://images.unsplash.com/photo-1608897013039-887f21d8c804",
    },
    {
      name: "Chicken Soup",
      servings: 6,
      ingredients: "chicken, noodles, carrots, celery, onion, chicken broth",
      instructions:
        "Simmer chicken in broth. Shred meat. Add vegetables and noodles. Cook until tender.",
      photo: "https://images.unsplash.com/photo-1547592166-23ac45744acd",
    },
    {
      name: "Chocolate Cake",
      servings: 10,
      ingredients: "flour, cocoa powder, sugar, eggs, butter, chocolate",
      instructions:
        "Mix dry ingredients. Cream butter and sugar. Add eggs. Combine all. Bake layers.",
      photo: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    },
    {
      name: "Pad Thai",
      servings: 3,
      ingredients:
        "rice noodles, shrimp, eggs, bean sprouts, tamarind, fish sauce",
      instructions:
        "Soak noodles. Stir-fry shrimp and eggs. Add noodles and sauce. Toss with sprouts.",
      photo: "https://images.unsplash.com/photo-1559314809-0f31657def5e",
    },
    {
      name: "Quesadillas",
      servings: 2,
      ingredients: "tortillas, cheese, chicken, peppers, onions",
      instructions:
        "Fill tortillas with cheese and fillings. Cook in pan until cheese melts and tortilla crisps.",
      photo: "https://images.unsplash.com/photo-1618040996337-56904b7850b9",
    },
  ];

  // Create 23 recipes with specific user assignments
  const recipes = [];

  // Define which recipes each user should get (by index)
  const userRecipeAssignments = {
    0: [0, 1, 2, 3, 4], // Alice: Pancakes, Stir Fry, Cookies, Caesar Salad, Tacos
    1: [5, 6, 7, 8, 9], // Bob: Risotto, Banana Bread, Salmon, Soup, Pizza
    2: [10, 11, 12, 13, 14], // Charlie: French Toast, Curry, Apple Pie, Carbonara, Greek Salad
    3: [15, 16, 17, 18], // Diana: Beef Stew, Lemon Bars, Fish & Chips, Caprese
    4: [19, 20, 21, 22], // Emma: Chicken Soup, Chocolate Cake, Pad Thai, Quesadillas
  };

  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    const user = users[userIndex];
    const recipeIndices = userRecipeAssignments[userIndex];

    console.log(
      `Creating ${recipeIndices.length} recipes for ${user.username}...`
    );

    for (const recipeIndex of recipeIndices) {
      const recipe = recipeData[recipeIndex];

      const createdRecipe = await createRecipe(
        recipe.name,
        recipe.servings,
        recipe.ingredients,
        recipe.instructions,
        user.id
      );

      await createPhoto(createdRecipe.id, recipe.photo);
      recipes.push(createdRecipe);
    }
  }

  // Randomly assign favorites (each user gets 3-7 random favorites)
  for (const user of users) {
    const numFavorites = Math.floor(Math.random() * 5) + 3; // 3-7 favorites
    const shuffledRecipes = [...recipes].sort(() => 0.5 - Math.random());

    for (let i = 0; i < numFavorites && i < shuffledRecipes.length; i++) {
      try {
        await addRecipeToFavorites(user.id, shuffledRecipes[i].id);
      } catch (error) {
        // Skip if favorite already exists or other error
        console.log(
          `Skipping duplicate favorite for user ${user.id}, recipe ${shuffledRecipes[i].id}`
        );
      }
    }
  }
}
