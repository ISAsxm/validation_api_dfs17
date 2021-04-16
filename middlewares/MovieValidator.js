const { body, validationResult } = require("express-validator")

class MovieValidator {
  createMovieValidation() {
    return [
      body("title")
        .notEmpty()
        .withMessage("This field is required, please provide a valid entry")
        .trim()
        .escape(),
      body("description")
        .notEmpty()
        .withMessage("This field is required, please provide a valid entry")
        .trim()
        .escape(),
      body("year")
        .notEmpty()
        .withMessage("This field is required, please provide a valid entry")
        .isNumeric()
        .isLength(4)
        .withMessage(
          "This field required a year of produced, please provide a valid entry"
        ),
      body("genreId")
        .notEmpty()
        .withMessage("This field is required, please provide a valid entry")
        .isNumeric()
        .withMessage(
          "This field required the Id of the movie's gender, please provide a valid entry"
        ),
      body("producerId")
        .notEmpty()
        .withMessage("This field is required, please provide a valid entry")
        .isNumeric()
        .withMessage(
          "This field required the Id of the movie's producer, please provide a valid entry"
        ),
    ]
  }

  updateMovieValidation() {
    return [
      body("title").trim().escape().optional({ nullable: true }),
      body("description").trim().escape().optional({ nullable: true }),
      body("year")
        .isNumeric()
        .isLength(4)
        .withMessage(
          "This field required a year of produced, please provide a valid entry"
        )
        .optional({ nullable: true }),
      body("genreId")
        .isNumeric()
        .withMessage(
          "This field required the Id of the movie's gender, please provide a valid entry"
        )
        .optional({ nullable: true }),
      body("producerId")
        .isNumeric()
        .withMessage(
          "This field required the Id of the movie's producer, please provide a valid entry"
        )
        .optional({ nullable: true }),
    ]
  }

  validate(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    return next()
  }
}

module.exports = new MovieValidator()
