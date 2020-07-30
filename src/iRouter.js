const express = require("express");
const data = require("./store");
const iService = require("./iService");
const { v4: uuid } = require("uuid");

const iRouter = express.Router();
const dataParser = express.json();

iRouter
  .route("/myworks")
  .get((req, res, next) => {
    const { userid } = req.query;
    const knexInstance = req.app.get("db");
    iService
      .getAllWritings(knexInstance, userid)
      .then((works) => {
        res.json(works);
      })
      .catch(next);
  })
  .post(dataParser, (req, res, next) => {
    const { user_id, title, content, wordcount } = req.body;
    const id = uuid();

    if (!title) {
      res.status(400).json({ error: "Please name your work" });
    }

    const newWork = {
      id: id,
      title: title,
      content: content,
      wordcount: wordcount,
      user_id: user_id,
    };

    iService
      .insertWork(req.app.get("db"), newWork)
      .then((work) => {
        res.status(201).json({ work });
      })
      .catch(next);
  });

iRouter
  .route("/myworks/id/:id")
  .delete((req, res, next) => {
    const { id } = req.params;
    iService
      .deleteWork(req.app.get("db"), id)
      .then(() => res.status(204).end())
      .catch(next);
  })
  .patch(dataParser, async (req, res, next) => {
    const { id } = req.params;
    const { title, content, wordcount } = req.body;
    const updatedObj = { title: title, content: content, wordcount: wordcount };
    await iService
      .updateWork(req.app.get("db"), id, updatedObj)
      .then(() => res.status(201).end())
      .catch(next);
  });

module.exports = iRouter;
