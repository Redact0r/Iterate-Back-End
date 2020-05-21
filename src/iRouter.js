const express = require("express");
const data = require("./store");
const iService = require("./iService");
const { v4: uuid } = require("uuid");

const iRouter = express.Router();
const dataParser = express.json();

iRouter
  .route("/myworks")
  .get((req, res, next) => {
    res.json(data);
  })
  .post(dataParser, (req, res) => {
    const { title, content, wordCount } = req.body;
    const id = uuid();

    if (!title) {
      res.status(400).json({ error: "Please name your work" });
    }

    const newWork = {
      id,
      title,
      content,
      wordCount,
    };

    data.push(newWork);
    res.status(201).json({ msg: "Saved!" });
  });

iRouter.route("/myworks/title/:searchtitle").get((req, res, next) => {
  const { searchtitle } = req.params;
  let worksByTitle = data.find((work) =>
    work.title.toLowerCase().includes(searchtitle.toLowerCase())
  );
  if (!worksByTitle) {
    return res.status(404).json({ err: "Not found" });
  }
  res.status(202).json(worksByTitle);
});

iRouter
  .route("/myworks/id/:id")
  .delete((req, res) => {
    const { id } = req.params;
    let delWorks = data.findIndex((work) => work.id === id);
    if (delWorks === -1) {
      return res.status(404).json({ err: "Not found" });
    }
    data.splice(delWorks, 1);

    res.status(202).json({ msg: "Successfully deleted" });
  })
  .put(dataParser, (req, res) => {
    const { id } = req.params;
    const { title, content, wordCount } = req.body;
    const updatedObj = { title, content, wordCount };
    let indexOfEntry = data.findIndex((work) => work.id === id);
    if (indexOfEntry === -1) {
      return res.status(404).json({ err: "Entry not found" });
    }
    data[indexOfEntry] = updatedObj;

    res.status(201).json({ msg: "Update successful!" });
  });

module.exports = iRouter;
