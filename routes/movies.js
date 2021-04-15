const { body } = require('express-validator');
const MovieController = require('../controllers').MovieController

let express = require('express')
let router = express.Router()

router.post('/movies',  body('title').trim().escape().not().isEmpty().withMessage('Invalid datas'), 
                        body('description').trim().escape().not().isEmpty(),
                        body('year').trim().escape().isDate({format: 'YYYY'}).not().isEmpty(),
                        MovieController.create);

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
