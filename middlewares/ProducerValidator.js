const { body, validationResult } = require("express-validator")

class ProducerValidator {
  createProducerValidation() {
    return [
      body("firstName")
        .notEmpty()
        .withMessage("This field is required, please provide a valid entry")
        .trim()
        .escape(),
      body("lastName")
        .notEmpty()
        .withMessage("This field is required, please provide a valid entry")
        .trim()
        .escape(),
    ]
  }

  updateProducerValidation() {
    return [
      body("firstName").trim().escape().optional({ nullable: true }),
      body("lastName").trim().escape().optional({ nullable: true }),
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

module.exports = new ProducerValidator()
