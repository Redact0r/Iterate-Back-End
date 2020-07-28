const express = require("express");
const StreakService = require("./streak-service");

const streakRouter = express.Router();
const jsonBodyParser = express.json();

streakRouter.post("/", jsonBodyParser, (req, res, next) => {
  //posts new streak for user
  const db = req.app.get("db");
  const { userid } = req.body;
  const id = parseInt(userid, 10);
  async function handlePostStreak() {
    const currentStreak = await StreakService.getStreakByUserId(db, id);

    if (currentStreak === null || 0) {
      return StreakService.postStreak(db, id, 1);
    }

    const newStreak = currentStreak + 1;

    StreakService.postStreak(db, id, newStreak).then(async () => {
      let returnStreak = await StreakService.getStreakByUserId(db, id);
      res.status(201).json({ returnStreak });
    });
  }
  handlePostStreak().catch(next);
});

streakRouter.get("/", (req, res, next) => {
  const db = req.app.get("db");
  const { userid } = req.query;

  async function getStreak() {
    const currentStreak = await StreakService.getStreakByUserId(db, userid);

    res.status(200).json({ currentStreak });
  }
  getStreak().catch(next);
});

streakRouter.post("/check", jsonBodyParser, (req, res, next) => {
  //checks the streak for the user, removing it if they haven't written in a full day since last time
  const db = req.app.get("db");
  const { userid } = req.body;
  const id = parseInt(userid, 10);
  const currentDate = new Date();

  async function handleStreakCheck() {
    const lastLogin = await StreakService.getLastSteakDate(db, id);
    console.log(lastLogin);
    if (!lastLogin) {
      StreakService.updateLastStreakDate(db, id, currentDate);
      return res.status(201).json({
        message: "Welcome to Iterate! Start typing and earn your first streak!",
      });
    }
    if (lastLogin) {
      //one hour less than 24 to be generous to the user - rounding up from their last hour
      const endOfNextDayHours = Math.abs(lastLogin.getHours() - 23);
      //if you wrote at 5am on Tuesday, then your streak expires 5am Wednesday. Undesirable -- user would expect to have until 23:59 Wednesday. We add 24 hours from the hours rounded down from the remaining of the current day to adjust for this.
      const endOfNextDay = endOfNextDayHours + 24;
      //returns milliseconds, divided by 3600000 to get hours
      const timeBetween = Math.abs(lastLogin - currentDate) / 3600000;

      if (timeBetween > endOfNextDay) {
        StreakService.loseStreak(db, id);
        StreakService.updateLastStreakDate(db, id, currentDate);
        return res.status(201).json({
          message:
            "Looks like you took a day or more off. Your streak has been reset. Don't worry, though, today is a new start!",
        });
      }

      return res.status(201).json({
        message: `Consistency is key! You're doing great. Submit your writing within ${
          timeBetween - endOfNextDay
        } hours to keep your streak!`,
      });
    }
    res.status(201).json({
      message:
        "Let's make today the start of a new habit! Earn your first streak!",
    });
  }
  handleStreakCheck().catch(next);
});

module.exports = streakRouter;
