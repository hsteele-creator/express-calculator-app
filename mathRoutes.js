const express = require("express");
const app = express();
const ExpressError = require("./ExpressError");

app.use(express.json());

app.get("/mean", (req, res, next) => {
  const queryNumbers = req.query.nums.split(",");
  const numbers = queryNumbers.map((str) => parseInt(str));
  const mean = numbers.reduce((acc, next) => (acc += next)) / numbers.length;

  try {
    res.json({ operation: "mean", value: `${mean}` });
  } catch (e) {
    next(e);
  }
});

app.use((error, req, res, next) => {
  return res.status(error.status).send(error.msg);
});

app.listen(3000, () => {
  console.log("The server is live");
});
