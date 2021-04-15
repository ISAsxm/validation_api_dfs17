const MovieController = require("../controllers").MovieController

let express = require("express")
let router = express.Router()

router.get("/movies/search", async (req, res, next) => {
  res.json(await MovieController.search(req.query.title))
})

router.get("/movies", async (req, res, next) => {
  res.json(
    await MovieController.list(req.query.size, req.query.page, req.query)
  )
})

router.get("/movies/:id", async (req, res, next) => {
  res.json(await MovieController.retrieve(req.params.id))
})

module.exports = router
