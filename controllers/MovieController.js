const Movie = require("../models").Movie
const Producer = require("../models").Producer
const Genre = require("../models").Genre
const { Op } = require("sequelize")

class MovieController {
  async search(search) {
    //  for research on attribut title http://localhost:3000/api/movies/search?title=Happy Weekend
    return Movie.findAll({
      include: [
        { model: Producer, required: true },
        { model: Genre, required: true },
      ],
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
    //  for paginate and limit set to http://localhost:3000/api/movies/?page=0&size=5 by default
    const limit = size ? +size : 5
    const offset = page ? page : 0

    //  for filtering with queryString http://localhost:3000/api/movies?genre=Comedy&year=2003 (not finished yet)
    return Movie.findAndCountAll({
      include: [
        { model: Producer, required: true },
        { model: Genre, required: true },
      ],
      limit: limit,
      offset: offset,
      order: [
        ["id", "DESC"],
        ["year", "ASC"],
      ],
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
