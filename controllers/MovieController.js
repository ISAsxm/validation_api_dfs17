const Movie = require("../models").Movie
const Producer = require("../models").Producer
const Genre = require("../models").Genre
const { Op } = require("sequelize")

class MovieController {
  async search(search) {
    //   http://localhost:3000/api/movies/search?title=Happy Weekend
    return Movie.findAll({
      where: {
        title: { [Op.like]: `%${search}` },
      },
    })
      .then((result) => {
        return result
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async list(size, page) {
    //   set to http://localhost:3000/api/movies/?page=1&size=5 by default
    const limit = size ? +size : 5
    const offset = page ? page : 1

    return Movie.findAndCountAll({
      include: [
        { model: Producer, required: true },
        { model: Genre, required: true },
      ],
      limit: limit,
      offset: offset,
    })
      .then((result) => {
        const lastPage = parseInt(result.count) / parseInt(size)

        result["self"] = `http://localhost:3000/api/?page=${offset}`

        if (0 >= parseInt(offset) - 1 >= parseInt(offset)) {
          result["prev"] = "null"
        } else {
          result["prev"] = `http://localhost:3000/api/?page=${
            parseInt(offset) - 1
          }`
        }

        if (parseInt(offset) + 1 > lastPage) {
          result["next"] = "null"
        } else {
          result["next"] = `http://localhost:3000/api/?page=${
            parseInt(offset) + 1
          }`
        }

        if (parseInt(offset) == lastPage) {
          result["last"] = "null"
        } else {
          result["last"] = `http://localhost:3000/api/?page=${lastPage}`
        }

        return result
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async retrieve(id) {
    return Movie.findOne({
      where: { id: id },
      include: [
        { model: Producer, required: true },
        { model: Genre, required: true },
      ],
    })
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
