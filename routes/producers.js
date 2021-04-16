const ProducerController = require("../controllers").ProducerController
const ProducerValidator = require("../middlewares").ProducerValidatorMiddleware

let express = require("express")
let router = express.Router()

router.post(
  "/producers",
  ProducerValidator.createProducerValidation(),
  ProducerValidator.validate,
  ProducerController.create
)

router.get("/producers", ProducerController.getAll)

router.get("/producers/:id", ProducerController.getOne)

router.patch(
  "/producers/:id",
  ProducerValidator.updateProducerValidation(),
  ProducerValidator.validate,
  ProducerController.update
)

router.delete("/producers/:id", ProducerController.destroy)

module.exports = router
