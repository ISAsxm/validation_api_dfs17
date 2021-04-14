const Producer = require("../models").Producer

class ProducerController {
  async list() {
    return Producer.findAll()
  }

  async retrieve(id) {
    return Producer.findByPk(id)
  }

  async create(producer) {
    return Producer.create(producer)
      .then((producer) => {
        return producer
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async update(id, datas) {
    return Producer.update(datas, {
      where: {
        id: id,
      },
    })
      .then((producer) => {
        return producer
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async destroy(id) {
    return Producer.destroy({
      where: {
        id: id,
      },
    })
  }
}

module.exports = new ProducerController()
