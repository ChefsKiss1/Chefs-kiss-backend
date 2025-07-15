import express from "express";
const router = express.Router();

import {
  createUser,
  getUserByUsernameAndPassword,
  getUserById,
} from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken, verifyToken } from "#utils/jwt";

// REGISTER
router
  .route("/register")
  .post(requireBody(["username", "email", "password"]), async (req, res) => {
    const { username, email, password } = req.body;
    const user = await createUser(username, email, password);

    const token = await createToken({ id: user.id });
    res.status(201).send(token);
  });

// LOGIN
router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) return res.status(401).send("Invalid username or password.");

    const token = await createToken({ id: user.id });
    res.send(token);
  });

// AUTHENTICATE MIDDLEWARE
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("No token provided");
  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

// PROFILE ROUTE
router.get("/profile", authenticate, async (req, res) => {
  const user = await getUserById(req.user.id);
  if (!user) return res.status(404).send("User not found");
  res.send({
    id: user.id,
    name: user.username,
    avatar:
      user.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`,
    email: user.email,
    // Add more fields if needed
  });
});

export default router;
