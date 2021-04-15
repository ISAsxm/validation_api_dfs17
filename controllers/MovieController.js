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
        res.json(result)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async create(req, res, next) {
    const { title, description, year } = req.body
    // const errors = validationResult(req)
    // if (!errors.isEmpty()){
    //   return res.status(400).json({ errors: errors.array()})
    // }
    
    if (title && description && year) {
      const movie = {
        title,
        description,
        year,
      }
      return res.status(201).json(await Movie.create(movie))
    }
    return res.status(400).json({
      error: `Sorry, wrong datas send`,
    })
  }

  async list(size, page, query) {
    const queryString = { ...query }
    const notSearchFields = ["size", "page"]
    notSearchFields.forEach((f) => delete queryString[f])

    // for group by and sort by with queryString http://localhost:3000/api/movies?sort=title&desc=year
    const sortSearchFields = ["sort", "desc"]
    const orderFilter = { order: [] }
    const groupFilter = { group: "" }
    // expected output
    // {
    //   order: [["title", "DESC"]]
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

    //  for filtering with queryString http://localhost:3000/api/movies?page=0&size=5&firstName=Rosina&lastName=Jerred&name=Comedy&year=2003
    const producerSearchFields = ["firstName", "lastName"]
    const producerFilter = {}
    producerSearchFields.forEach((f) => {
      if (queryString[f]) {
        producerFilter[f] = queryString[f]
        delete queryString[f]
      }
    })
    const categorySearchField = ["name"]
    const categoryFilter = { name: "" }
    categorySearchField.forEach((f) => {
      if (queryString[f]) {
        categoryFilter[f] = queryString[f]
        delete queryString[f]
      }
    })
    const movieFilter = queryString ? queryString : {}

    //  for paginate and limit set to http://localhost:3000/api/movies?page=1&size=5 by default
    const limit = size ? +size : 5
    const offset = page ? page : 1

    return Movie.findAndCountAll({
      include: [
        {
          model: Producer,
          required: true,
          where: producerFilter,
        },
        {
          model: Genre,
          required: true,
          where: {
            name: { [Op.substring]: `%${categoryFilter["name"]}%` },
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

        if (parseInt(offset) + 1 > lastPage) {
          result["next"] = "null"
        } else {
          result["next"] = `http://localhost:3000/api/movies?page=${
            parseInt(offset) + 1
          }`
        }

        if (parseInt(offset) == lastPage) {
          result["last"] = "null"
        } else {
          result["last"] = `http://localhost:3000/api/movies?page=${lastPage}`
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

  async update(req, res, next) {
    const { id } = req.params
    const { title, description, year } = req.body
    if (!title && !description && !year) {
      res.status(400).end()
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
      res.json(await Producer.findByPk(id.id))
      return
    }

    res.status(404).json({ error: "Movie doesn't exist" })
  }

  async destroy(req, res, next) {
    const { id } = req.params
    const movie = await Movie.destroy({
      where: {
        /*id:*/ id,
      },
    })
    if (!movie) {
      res.status(404).json(`Le movie avec l'id ${id} n'existe pas en base`)
    }
    res.status(204).end()
  }
}

module.exports = new MovieController()
