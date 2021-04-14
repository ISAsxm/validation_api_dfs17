const MovieController = require("../controllers").MovieController

let express = require("express")
let router = express.Router()

router.get("/movies", async (req, res, next) => {
  console.log(req.query)
  const limit = req.query.size ? +req.query.size : 3
  const offset = req.query.page ? req.query.page * limit : 2
  console.log(limit, offset)
  res.json(await MovieController.list(limit, offset))
})

module.exports = router
