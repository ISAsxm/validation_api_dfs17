const { body, validationResult } = require("express-validator")

class ProducerValidator {
  createProducerValidation() {
    return [
      body("firstName")
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage("This field is required, please provide a valid entry"),
      body("lastName")
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage("This field is required, please provide a valid entry"),
    ]
  }

  updateProducerValidation() {
    return [body("firstName").trim().escape(), body("lastName").trim().escape()]
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
