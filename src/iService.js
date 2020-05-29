const iService = {
  getAllWritings(db) {
    return db("userworks").select("*");
  },
  insertWork(db, newWork) {
    return db
      .into("userworks")
      .insert(newWork)
      .returning("*")
      .then((rows) => rows[0]);
  },
  deleteWork(db, id) {
    return db("userworks").where("id", id).delete();
  },
  updateWork(db, id, updatedObj) {
    return db("userworks").where("id", id).update(updatedObj);
  },
};

module.exports = iService;
