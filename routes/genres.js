const GenreController = require('../controllers').GenreController;

let express = require ('express');
let router = express.Router();

router.get('/genres', async(req, res, next) =>{
    res.json(await GenreController.getAll())
});

module.exports = router;