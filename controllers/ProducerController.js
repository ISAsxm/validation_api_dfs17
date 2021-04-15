const Producer = require("../models").Producer

class ProducerController {
  async getAll(req, res, next) {
    const producer = await Producer.findAll()
    res.json(producer)
  }

  async getOne(req, res, next) {
    const producer = await Producer.findByPk(req.params.id)
    if (producer === null) {
      return res.status(404).json({
        error: `Sorry, the producer matching the id ${req.params.id} was not found in the database.`,
      })
    }
    return res.status(200).json(producer)
  }

  async create(req, res, next) {
    const { firstName, lastName } = req.body
    if (firstName && lastName) {
      const producer = {
        firstName,
        lastName,
      }
      return res.status(201).json(await Producer.create(producer))
    }
    return res.status(400).json({
      error: `An error occurred while processing your request, please try again after verifying the request parameters provided`,
    })
  }

  async update(req, res, next) {
    const { id } = req.params
    const { firstName, lastName } = req.body
    if (!firstName && !lastName) {
      res
        .status(400)
        .json(
          `An error occurred while processing your request, please try again after verifying the request parameters provided`
        )
      return
    }
    const updatedProducer = await Producer.update(
      { firstName, lastName },
      {
        where: {
          id,
        },
      }
    )
    if (updatedProducer[0] === 1) {
      res.json(await Producer.findByPk(id))
      return
    }

    res.status(404).json({
      error: `Sorry, the movie matching the id ${req.params.id} was not found in the database.`,
    })
  }

  async destroy(req, res, next) {
    const { id } = req.params
    const producer = await Producer.destroy({
      where: {
        /*id:*/ id,
      },
    })
    if (!producer) {
      res
        .status(404)
        .json(
          `Sorry, the movie matching the id ${req.params.id} was not found in the database.`
        )
    }
    res.status(204).end()
  }
}

module.exports = new ProducerController()
