/*
 ************************************************************************
 ************************************************************************
 **                                                                    **
 **                      HAPPY BIRTHDAY RIRI :D                        **
 **                                                                    **
 ************************************************************************
 ************************************************************************
 */

const MovieController = require("../controllers").MovieController
const MovieValidator = require("../middlewares").MovieValidatorMiddleware

let express = require("express")
let router = express.Router()

router.get("/movies/search", MovieController.search)

router.get("/movies", MovieController.list)

router.get("/movies/:id", MovieController.retrieve)

router.post(
  "/movies",
  MovieValidator.createMovieValidation(),
  MovieValidator.validate,
  MovieController.create
)

router.patch(
  "/movies/:id",
  MovieValidator.updateMovieValidation(),
  MovieValidator.validate,
  MovieController.update
)

router.delete("/movies/:id", MovieController.destroy)

module.exports = router
