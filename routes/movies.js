const MovieController = require('../controllers').MovieController

let express = require("express")
let router = express.Router()

//router.post('/movies', MovieController.create);

router.get('/movies', MovieController.getAll);

//router.get('/movies/:id', MovieController.getOne);

//router.patch('/movies/:id', MovieController.update);

//router.delete('/movies/:id', MovieController.destroy);

module.exports = router
