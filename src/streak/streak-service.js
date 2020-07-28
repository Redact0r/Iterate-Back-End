const StreakService = {
  getStreakByUserId(db, userid) {
    return db("iterateusers")
      .select("streak")
      .where({ userid })
      .then((res) => res[0].streak);
  },
  postStreak(db, userid, streak) {
    return db("iterateusers").where("userid", userid).update("streak", streak);
  },
  getLastSteakDate(db, userid) {
    return db("iterateusers")
      .select("last_login")
      .where({ userid })
      .then((res) => res[0].last_login);
  },
  loseStreak(db, userid) {
    return db("iterateusers").where({ userid }).update({ streak: 0 });
  },
  setLastStreakDate(db, userid, currentDate) {
    return db("iterateusers")
      .where({ userid })
      .update({ last_login: currentDate });
  },
};

module.exports = StreakService;
