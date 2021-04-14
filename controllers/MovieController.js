const Movie = require("../models").Movie

class MovieController {
  async list() {
    return Movie.findAndCountAll({ limit: 2, offset: 3 })
  }

  async retrieve(id) {
    return Movie.findByPk(id)
  }

  async create(Movie) {
    return Movie.create(Movie)
      .then((Movie) => {
        return Movie
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async update(id, datas) {
    return Movie.update(datas, {
      where: {
        id: id,
      },
    })
      .then((Movie) => {
        return Movie
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async destroy(id) {
    return Movie.destroy({
      where: {
        id: id,
      },
    })
  }
}

module.exports = new MovieController()
