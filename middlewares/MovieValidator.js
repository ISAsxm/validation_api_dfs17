const { body, validationResult } = require("express-validator")

class MovieValidator {
  createMovieValidation() {
    return [
      body("title")
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage("This field is required, please provide a valid entry"),
      body("description")
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage("This field is required, please provide a valid entry"),
      body("year")
        .isNumeric()
        .isLength(4)
        .withMessage(
          "This field required a year of produced, please provide a valid entry"
        )
        .not()
        .isEmpty()
        .withMessage("This field is required, please provide a valid entry"),
      body("genreId")
        .isNumeric()
        .withMessage(
          "This field required the Id of the movie's gender, please provide a valid entry"
        )
        .not()
        .isEmpty()
        .withMessage("This field is required, please provide a valid entry"),
      body("producerId")
        .isNumeric()
        .withMessage(
          "This field required the Id of the movie's producer, please provide a valid entry"
        )
        .not()
        .isEmpty()
        .withMessage("This field is required, please provide a valid entry"),
    ]
  }

  updateMovieValidation() {
    return [
      body("title").trim().escape(),
      body("description").trim().escape(),
      body("year")
        .isNumeric()
        .isLength(4)
        .withMessage(
          "This field required a year of produced, please provide a valid entry"
        ),
      body("genreId")
        .isNumeric()
        .withMessage(
          "This field required the Id of the movie's gender, please provide a valid entry"
        ),
      body("producerId")
        .isNumeric()
        .withMessage(
          "This field required the Id of the movie's producer, please provide a valid entry"
        ),
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
