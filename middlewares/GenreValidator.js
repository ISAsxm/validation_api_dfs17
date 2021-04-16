const { body, validationResult } = require("express-validator")

class GenreValidator {
  createGenreValidation() {
    return [
      body("name")
        .notEmpty()
        .withMessage("This field is required, please provide a valid entry")
        .trim()
        .escape(),
    ]
  }

  updateGenreValidation() {
    return [body("name").trim().escape()]
  }

  validate(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    return next()
  }
}

module.exports = new GenreValidator()
