//const { body } = require('express-validator');
const producerRouter = require("./producers")
const movieRouter = require("./movies")
const genreRouter = require("./genres")

module.exports = function (app) {
  app.use("/api", [producerRouter, movieRouter, genreRouter])
}
