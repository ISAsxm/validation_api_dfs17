const MovieController = require('../controllers').MovieController

let express = require('express')
let router = express.Router()

router.post('/movies', MovieController.create);

router.get('/movies/search', MovieController.search);

router.get("/movies", async (req, res, next) => {
  res.json(
    await MovieController.list(req.query.size, req.query.page, req.query)
  )
})

router.get('/movies/:id', async (req, res, next) => {
    res.json(await MovieController.retrieve(req.params.id))
})

router.patch('/movies/:id', MovieController.update);

router.delete('/movies/:id', MovieController.destroy);

module.exports = router
