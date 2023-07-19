const express = require("express");
const app = express();
const ExpressError = require("./ExpressError");

app.use(express.json());

app.get("/mean", (req, res, next) => {
  if (!req.query.nums)
    throw new ExpressError("query must be comma seperated values", 400);
  const queryNumbers = req.query.nums.split(",");
  const numbers = queryNumbers.map((str) => parseInt(str));
  const mean = numbers.reduce((acc, next) => (acc += next)) / numbers.length;

  try {
    return res.json({ operation: "mean", value: `${mean}` });
  } catch (e) {
    next(e);
  }
});

app.get("/median", (req, res, next) => {
  if (!req.query.nums)
    throw new ExpressError("query must be comma seperated values", 400);
  const numbers = req.query.nums
    .split(",")
    .map((str) => parseInt(str))
    .sort((a, b) => a - b);
  const isEven = numbers.length % 2 === 0;
  const mid = Math.floor(numbers.length / 2);
  const middle = !isEven ? numbers[mid] : (numbers[mid - 1] + numbers[mid]) / 2;
  try {
    return res.json({ operation: "median", value: `${middle}` });
  } catch (e) {
    next(e);
  }
});

app.get("/mode", (req, res, next) => {
  if (!req.query.nums)
    throw new ExpressError("query must be comma seperated values", 400);

  const numbers = req.query.nums.split(",").map((str) => parseInt(str));

  try {
    let count = {};
    for (let i = 0; i < numbers.length; i++) {
      if (count[numbers[i]]) {
        count[numbers[i]] += 1;
      } else {
        count[numbers[i]] = 1;
      }
    }

    const values = Object.values(count);

    const biggestNum = values.reduce((acc, next) => {
      return next > acc ? next : acc;
    }, 0);

    const mode = Object.keys(count).find((num) => count[num] === biggestNum);

    res.json({ operation: "mode", value: mode });
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
