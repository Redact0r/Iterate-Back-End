const express = require("express");
const AuthService = require("./auth-service");
const { requireAuth } = require("../middleware/jwt-auth");

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter.post("/", jsonBodyParser, async (req, res, next) => {
  const db = req.app.get("db");
  const { user_name, password } = req.body;
  const loginUser = { user_name: user_name, password: password };

  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });
  try {
    const dbUser = await AuthService.getUserWithUserName(
      db,
      loginUser.user_name
    );

    if (!dbUser)
      return res.status(400).json({
        error: "Incorrect username or password",
      });

    const compareMatch = await AuthService.comparePasswords(
      loginUser.password,
      dbUser.password
    );

    if (!compareMatch)
      return res.status(400).json({
        error: "Incorrect username or password",
      });

    const sub = dbUser.username;
    const payload = {
      user_id: dbUser.id,
    };
    res.send({
      authToken: AuthService.createJwt(sub, payload),
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/refresh", requireAuth, (req, res) => {
  const sub = req.user.user_name;
  const payload = { user_id: req.user.id };
  res.send({
    authToken: AuthService.createJwt(sub, payload),
  });
});

module.exports = authRouter;
