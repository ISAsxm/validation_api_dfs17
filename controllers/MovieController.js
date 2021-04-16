const Movie = require("../models").Movie
const Producer = require("../models").Producer
const Genre = require("../models").Genre
const { Op } = require("sequelize")
//const { body } = require('express-validator');
class MovieController {
  async search(req, res, next) {
    //  for research on attribut title http://localhost:3000/api/movies/search?title=Happy Weekend

    return Movie.findAll({
      include: [
        { model: Producer, required: true },
        { model: Genre, required: true },
      ],
      where: {
        title: { [Op.like]: `${req.query.title}%` },
      },
    })
      .then((result) => {
        if (result.length <= 0) {
          return res
            .status(404)
            .json(
              `Sorry, the films matching your query filters were not found in the database.`
            )
        }
        res.json(result)
      })
      .catch((err) => {
        console.log(err)
        return res
          .status(400)
          .json(
            `An error occurred while processing your request, please try again after verifying the request parameters provided`
          )
      })
  }

  async create(req, res, next) {
    const { title, description, year, producerId, genreId } = req.body

    if (!(await Producer.findByPk(producerId))) {
      return res
        .status(400)
        .json(
          `Sorry, the producer matching the id ${producerId} was not found in the database.`
        )
    }
    if (!(await Genre.findByPk(genreId))) {
      return res
        .status(400)
        .json(
          `Sorry, the genre matching the id ${genreId} was not found in the database.`
        )
    }

    if (title && description && year) {
      const movie = {
        title,
        description,
        year,
        producerId,
        genreId,
      }
      const newMovie = await Movie.create(movie)
      return res.status(201).json(newMovie)
    }
    return res.status(400).json({
      error: `An error occurred while processing your request, please check the data set entered`,
    })
  }

  async list(req, res, next) {
    const queryString = { ...req.query }
    const notSearchFields = ["size", "page"]
    notSearchFields.forEach((f) => delete queryString[f])

    // for group by and sort by with queryString http://localhost:3000/api/movies?sort=title&desc=year
    const sortSearchFields = ["sort", "desc"]
    const orderFilter = { order: [] }
    const groupFilter = { group: "" }
    // example of expected output
    // {
    //   order: [["year", "DESC"]]
    // }
    // {group: 'title'}
    sortSearchFields.forEach((f) => {
      if (queryString[f] && f === "sort") {
        groupFilter.group = queryString[f]
        delete queryString[f]
      }
      if (queryString[f] && f === "desc") {
        orderFilter.order.push([queryString[f], "DESC"])
        delete queryString[f]
      }
    })

    //  for filtering with queryString http://localhost:3000/api/movies?page=0&size=5&producer=Jerred&genre=Comedy&year=2003
    const producerSearchFields = ["producer"]
    const producerFilter = { producer: "" }
    producerSearchFields.forEach((f) => {
      if (queryString[f]) {
        producerFilter[f] = queryString[f]
        delete queryString[f]
      }
    })
    const categorySearchField = ["genre"]
    const categoryFilter = { genre: "" }
    categorySearchField.forEach((f) => {
      if (queryString[f]) {
        categoryFilter[f] = queryString[f]
        delete queryString[f]
      }
    })
    const movieFilter = queryString ? queryString : {}

    //  for paginate and limit set to http://localhost:3000/api/movies?page=0&size=5 by default
    const limit = req.query.size ? +req.query.size : 5
    const offset = req.query.page ? req.query.page : 0

    return Movie.findAndCountAll({
      include: [
        {
          model: Producer,
          required: true,
          where: {
            [Op.or]: [
              {
                firstName: {
                  [Op.substring]: `%${producerFilter["producer"]}%`,
                },
              },
              {
                lastName: {
                  [Op.substring]: `%${producerFilter["producer"]}%`,
                },
              },
            ],
          },
        },
        {
          model: Genre,
          required: true,
          where: {
            name: { [Op.substring]: `%${categoryFilter["genre"]}%` },
          },
        },
      ],
      where: movieFilter,
      limit: limit,
      offset: offset,
      order: orderFilter.order,
      group: groupFilter.group,
    })
      .then((result) => {
        if (result.rows.length <= 0) {
          return res
            .status(404)
            .json(
              `Sorry, the films matching your query filters were not found in the database.`
            )
        }
        const lastPage = Math.ceil(
          Array.isArray(result.count)
            ? result.count.length
            : parseInt(result.count) / parseInt(limit)
        )

        result["self"] = `http://localhost:3000/api/movies?page=${offset}`

        if (0 >= parseInt(offset) - 1 >= parseInt(offset)) {
          result["prev"] = "null"
        } else {
          result["prev"] = `http://localhost:3000/api/movies?page=${
            parseInt(offset) - 1
          }`
        }

        if (lastPage === 1 || parseInt(offset) + 1 > lastPage) {
          result["next"] = "null"
        } else {
          result["next"] = `http://localhost:3000/api/movies?page=${
            parseInt(offset) + 1
          }`
        }

        if (0 >= parseInt(offset) >= lastPage) {
          result["last"] = `http://localhost:3000/api/movies?page=${offset}`
        } else {
          result["last"] = `http://localhost:3000/api/movies?page=${lastPage}`
        }

        return res.json(result)
      })
      .catch((err) => {
        console.log(err)
        return res
          .status(400)
          .json(
            `An error occurred while processing your request, please try again after verifying the request parameters provided`
          )
      })
  }

  async retrieve(req, res, next) {
    return Movie.findOne({
      where: { id: req.params.id },
      include: [
        { model: Producer, required: true },
        { model: Genre, required: true },
      ],
    })
      .then((result) => {
        if (result === null) {
          return res
            .status(404)
            .json(
              `Sorry, the movie matching the id ${req.params.id} was not found in the database.`
            )
        }
        return res.json(result)
      })
      .catch((err) => {
        console.log(err)
        return res
          .status(400)
          .json(
            `An error occurred while processing your request, please try again after verifying the request parameters provided`
          )
      })
  }

  async update(req, res, next) {
    const { id } = req.params
    const { title, description, year } = req.body
    if (!title && !description && !year) {
      res
        .status(400)
        .json(
          `An error occurred while processing your request, please check the data set entered.`
        )
      return
    }
    const updatedMovie = await Movie.update(
      { title, description, year },
      {
        where: {
          id,
        },
      }
    )
    if (updatedMovie[0] === 1) {
      res.json(await Movie.findByPk(id))
      return
    }

    res.status(404).json({
      error: `Sorry, the movie matching the id ${req.params.id} was not found in the database.`,
    })
  }

  async destroy(req, res, next) {
    const { id } = req.params
    const movie = await Movie.destroy({
      where: {
        /*id:*/ id,
      },
    })
    if (!movie) {
      res
        .status(404)
        .json(
          `Sorry, the movie matching the id ${req.params.id} was not found in the database.`
        )
    }
    res.status(204).end()
  }
}

module.exports = new MovieController()
