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
    const streakCheck = await getStreakByUserId(db, userid);
    if (!lastLogin || streakCheck === 0) {
      await StreakService.updateLastStreakDate(db, id, currentDate);
      return res.status(201).json({
        message: "Welcome to Iterate! Write today and earn a new streak!",
      });
    }
    if (lastLogin) {
      //one hour more than 24 to be generous to the user - rounding up from their last hour
      const endOfNextDayHours = Math.abs(lastLogin.getHours() - 25);
      //if you wrote at 5am on Tuesday, then your streak expires 5am Wednesday. Undesirable -- user would expect to have until 23:59 Wednesday. We add 24 hours from the hours rounded down from the remaining of the current day to adjust for this.
      const endOfNextDay = endOfNextDayHours + 24;
      //returns milliseconds, divided by 3600000 to get hours
      const timeBetween = Math.abs(lastLogin - currentDate) / 3600000;

      if (timeBetween > endOfNextDay) {
        await StreakService.loseStreak(db, id);
        await StreakService.updateLastStreakDate(db, id, currentDate);
        return res.status(201).json({
          lastLogin,
          message:
            "Looks like you took a day or more off. Your streak has been reset. Don't worry, though, today is a new start!",
        });
      }

      return res.status(201).json({
        lastLogin,
        message: `Consistency is key! You're doing great. Submit your writing by end of the day ${
          lastLogin.getMonth() + 1
        }/${lastLogin.getDate() + 1} to keep your streak!`,
      });
    }
  }
  handleStreakCheck().catch(next);
});

module.exports = streakRouter;
