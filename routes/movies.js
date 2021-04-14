const MovieController = require("../controllers").MovieController

let express = require("express")
let router = express.Router()

router.get("/movies", async (req, res, next) => {
  const size = req.query.size
  const page = req.query.page
  res.json(await MovieController.list(size, page))
})

module.exports = router
