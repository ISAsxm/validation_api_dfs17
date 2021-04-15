const GenreController = require("../controllers").GenreController

let express = require("express")
let router = express.Router()

router.post("/Genres", GenreController.create)

router.get("/Genres", GenreController.list)

router.get("/Genres/:id", GenreController.retrieve)

router.patch("/Genres/:id", GenreController.update)

router.delete("/Genres/:id", GenreController.destroy)

module.exports = router
