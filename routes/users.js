const router = require("express").Router();
let User = require("../models/user.model");
const {
  validateCreateUserBody,
  validateCreateExerciseBody,
} = require("../middlewares/validation");
const { ERROR_MSG } = require("../utils/constants");
const { filterLogsByDateRange } = require("../utils/filterLogsArray");
const ConflictError = require("../errors/conflict-err");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");

router.route("/").get((req, res, next) => {
  User.find()
    .select("_id username")
    .then((users) => res.json(users))
    .catch((err) => next(err));
});

router.route("/").post(validateCreateUserBody, (req, res, next) => {
  const username = req.body.username;
  return User.findOne({ username })
    .then((user) => {
      if (user) {
        throw new ConflictError(ERROR_MSG.CONFLICT_USERNAME);
      }
      User.create({ username })
        .then((newUser) => res.json(newUser))
        .catch((err) => {
          if (err.name === "ValidationError") {
            throw new BadRequestError(ERROR_MSG.BAD_REQUEST);
          }
        });
    })
    .catch((err) => next(err));
});

router
  .route("/:_id/exercises")
  .post(validateCreateExerciseBody, (req, res, next) => {
    const _id = req.params._id;
    let { description, duration, date } = req.body;

    if (!date) {
      date = new Date().toDateString();
    } else {
      if (new Date(date).toDateString() == "Invalid Date") {
        throw new BadRequestError(ERROR_MSG.INVALID_DATE);
      }
      date = new Date(date).toDateString();
    }

    User.findByIdAndUpdate(
      _id,
      { $push: { log: { description, duration, date } }, $inc: { count: 1 } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          throw new NotFoundError(ERROR_MSG.NOT_FOUND_USER);
        }

        return res.json({
          _id,
          username: user.username,
          description,
          duration,
          date,
        });
      })
      .catch((err) => next(err));
  });

router.route("/:_id/logs").get((req, res, next) => {
  const { _id } = req.params;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        res.status(404).send(ERROR_MSG.NOT_FOUND_USER);
      }

      let response = {
        _id: user._id,
        username: user.username,
      };

      const logsArray = filterLogsByDateRange(user.log, req.query);
      response = { ...response, count: logsArray.length, log: logsArray };

      return res.json(response);
    })
    .catch((err) => next(err));
});

module.exports = router;
