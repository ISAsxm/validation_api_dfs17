const GenreController = require("../controllers").GenreController
const GenreValidator = require("../middlewares").GenreValidatorMiddleware

let express = require("express")
let router = express.Router()

router.get("/genres", GenreController.list)

router.get("/genres/:id", GenreController.retrieve)

router.post(
  "/genres",
  GenreValidator.createGenreValidation(),
  GenreValidator.validate,
  GenreController.create
)

router.patch(
  "/genres/:id",
  GenreValidator.updateGenreValidation(),
  GenreValidator.validate,
  GenreController.update
)

router.delete("/genres/:id", GenreController.destroy)

module.exports = router
