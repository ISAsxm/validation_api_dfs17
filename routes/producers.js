const ProducerController = require('../controllers').ProducerController

let express = require("express")
let router = express.Router()

router.post('/producers', ProducerController.create);

router.get('/producers', ProducerController.getAll);

router.get('/producers/:id', ProducerController.getOne);

router.patch('/producers/:id', ProducerController.update);

router.delete('/producers/:id', ProducerController.destroy);

module.exports = router
