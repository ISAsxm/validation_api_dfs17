const Genre = require("../models").Genre

class GenreController {
  async list(req, res, next) {
    const categories = await Genre.findAll()
    return res.json(categories)
  }

  async retrieve(req, res, next) {
    const category = await Genre.findByPk(req.params.id)
    if (category === null) {
      return res.status(404).json({
        error: `Sorry, the Genre matching the id ${req.params.id} was not found in the database.`,
      })
    }
    return res.status(200).json(category)
  }

  async create(req, res, next) {
    const name = req.body.name
    if (name) {
      return res.status(201).json(await Genre.create({ name: name }))
    }
    return res.status(400).json({
      error: `An error occurred while processing your request, please try again after verifying the request parameters provided`,
    })
  }

  async update(req, res, next) {
    const id = req.params.id
    const name = req.body.name
    if (!name) {
      return res
        .status(400)
        .json(
          `An error occurred while processing your request, please try again after verifying the request parameters provided`
        )
    }
    const updatedGenre = await Genre.update(
      { name: name },
      {
        where: {
          id: id,
        },
      }
    )
    if (updatedGenre[0] === 1) {
      return res.json(await Genre.findByPk(id))
    }

    return res.status(404).json({
      error: `Sorry, the movie matching the id ${req.params.id} was not found in the database.`,
    })
  }

  async destroy(req, res, next) {
    const id = req.params.id
    const category = await Genre.destroy({
      where: {
        id: id,
      },
    })
    if (category === 1) {
      return res.status(204).end()
    }
    return res
      .status(404)
      .json(
        `Sorry, the movie matching the id ${req.params.id} was not found in the database.`
      )
  }
}

module.exports = new GenreController()
