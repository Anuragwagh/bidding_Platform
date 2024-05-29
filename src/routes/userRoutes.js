const express = require("express");
const { register, login } = require("../services/authService");
const { authenticate } = require("../middleware/auth");

const router = new express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const { user, token } = await register(username, password, email);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await login(username, password);
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/profile", authenticate, (req, res) => {
  res.send(req.user);
});

module.exports = router;
