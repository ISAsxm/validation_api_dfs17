const { body } = require("express-validator")
const MovieController = require("../controllers").MovieController

let express = require("express")
let router = express.Router()

router.post(
  "/movies",
  body("title").trim().escape().not().isEmpty().withMessage("Invalid datas"),
  body("description").trim().escape().not().isEmpty(),
  body("year").trim().escape().isDate({ format: "YYYY" }).not().isEmpty(),
  MovieController.create
)

router.get("/movies/search", MovieController.search)

router.get("/movies", MovieController.list)

router.get("/movies/:id", MovieController.retrieve)

router.patch("/movies/:id", MovieController.update)

router.delete("/movies/:id", MovieController.destroy)

module.exports = router
