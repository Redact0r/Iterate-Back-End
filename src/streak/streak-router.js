const express = require("express");
const StreakService = require("./streak-service");

const streakRouter = express.Router();
const jsonBodyParser = express.json();

streakRouter.post("/", jsonBodyParser, (req, res, next) => {
  //posts new streak for user
  const db = req.app.get("db");
  const { userid } = req.body;
  const currentStreak = StreakService.getStreakByUserId(db, userid);

  if (currentStreak === null || 0) {
    return StreakService.postStreak(db, userid, 1);
  }

  const newStreak = currentStreak + 1;

  StreakService.postStreak(db, userid, newStreak)
    .then(() => {
      let returnStreak = StreakService.getStreakByUserId(db, userid);
      res.status(201).json({ returnStreak });
    })
    .catch(next);
});

streakRouter.get("/", (req, res, next) => {
  const db = req.app.get("db");
  const { userid } = req.query;

  const currentStreak = StreakService.getStreakByUserId(db, userid);

  res.status(200).json({ currentStreak }).catch(next);
});

streakRouter.post("/check", jsonBodyParser, (req, res, next) => {
  //checks the streak for the user, removing it if they haven't written in a full day since last time
  const db = req.app.get("db");
  const { userid } = req.body;
  const currentDate = new Date();

  const lastLogin = StreakService.getLastSteakDate(db, userid);
  if (lastLogin) {
    //one hour less than 24 to be generous to the user - rounding up from their last hour
    const endOfNextDayHours = Math.abs(lastLogin.getHours() - 23);
    //if you wrote at 5am on Tuesday, then your streak expires 5am Wednesday. Undesirable -- user would expect to have until 23:59 Wednesday. We add 24 hours from the hours rounded down from the remaining of the current day to adjust for this.
    const endOfNextDay = endOfNextDayHours + 24;
    //returns milliseconds, divided by 3600000 to get hours
    const timeBetween = Math.abs(lastLogin - currentDate) / 3600000;

    if (timeBetween > endOfNextDay) {
      StreakService.loseStreak(db, userid);
      StreakService.setLastStreakDate(db, userid, currentDate);
      return res.status(201).json({
        message:
          "Looks like you took a day or more off. Your streak has been reset. Don't worry, though, today is a new start!",
      });
    }
    StreakService.setLastStreakDate(db, userid, currentDate);

    return res
      .status(201)
      .json({
        message: `Consistency is key! You're doing great. Submit your writing within ${
          timeBetween - endOfNextDay
        } hours to keep your streak!`,
      })
      .catch(next);
  }
  res
    .status(201)
    .json({ message: "Congrats on your first streak! Keep it up!" })
    .catch(next);
});

module.exports = streakRouter;
