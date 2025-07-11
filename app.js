import express from "express";
const app = express();
export default app;

import recipeRouter from "./api/recipes.js";
import usersRouter from "#api/users";
import getUserFromToken from "#middleware/getUserFromToken";
import favoritesRouter from "./api/favorites.js";
import photosRouter from "./api/photos.js";
import handlePostgresErrors from "#middleware/handlePostgresErrors";
import cors from "cors";
import morgan from "morgan";

app.use(cors({ origin: process.env.CORS_ORIGIN ?? /localhost/ }));

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(getUserFromToken);

app.get("/", (req, res) => res.send("Hello, World!"));

app.use("/users", usersRouter);
app.use("/recipes", recipeRouter);
app.use("/recipes/favorites", favoritesRouter);
app.use("/photos", photosRouter);

// app.use(handlePostgresErrors);
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).send("Sorry! Something went wrong.");
// });
