const GenreController = require("../controllers").GenreController

let express = require("express")
let router = express.Router()

router.get("/genres", GenreController.list)

router.get("/genres/:id", GenreController.retrieve)

router.post("/genres", GenreController.create)

router.patch("/genres/:id", GenreController.update)

router.delete("/genres/:id", GenreController.destroy)

module.exports = router
