const express = require("express");
const app = express();
const cors = require("cors");
const { errors, isCelebrateError } = require("celebrate");
const { ERROR_MSG } = require("./utils/constants");
const mongoose = require("mongoose");

const usersRouter = require("./routes/users");

require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection successfull");
});

app.use("/api/users", usersRouter);

app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    console.log(err);
  }
  next(err);
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? ERROR_MSG.INTERNAL : message,
  });
  next();
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
