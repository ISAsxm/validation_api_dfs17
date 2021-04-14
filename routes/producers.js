const ProducerController = require("../controllers").ProducerController

let express = require("express")
let router = express.Router()

router.get("/producers", async (req, res, next) => {
  res.json(await ProducerController.list())
})

router.get("/producers/:id", async (req, res, next) => {
  const producer = await ProducerController.retrieve(req.params.id)
  if (producer === null) {
    return res.status(404).json({
      error: `Sorry, Producer with id ${req.params.id} doesn't exist in the database`,
    })
  }
  return res.status(200).json(producer)
})

router.post("/producers", async (req, res, next) => {
  console.dir(req.body)
  if (req.body.firstName && req.body.lastName) {
    const producer = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    }
    return res.status(201).json(await ProducerController.create(producer))
  }
  return res.status(400).json({
    error: `Sorry, wrong datas send`,
  })
})

router.patch("/producers/:id", async (req, res, next) => {
  if (!req.body.firstName && !req.body.lastName) {
    return res.status(400).json({
      error: `Sorry, wrong datas send`,
    })
  }
  const producer = await ProducerController.retrieve(req.params.id)
  let datas = {}
  if (req.body.firstName) {
    datas["firstName"] = req.body.firstName
  } else {
    datas["firstName"] = producer.firstName
  }
  if (req.body.lastName) {
    datas["lastName"] = req.body.lastName
  } else {
    datas["lastName"] = producer.lastName
  }
  const updatedProducer = await ProducerController.update(producer.id, datas)
  if (updatedProducer[0] === 1) {
    return res.status(200).json(await producer.reload())
  }
  return res.status(404).json({
    error: `Sorry, Producer with id ${req.params.id} doesn't exist in the database`,
  })
})

router.delete("/producers/:id", async (req, res, next) => {
  const producer = await ProducerController.retrieve(req.params.id)
  if (ProducerController.destroy(producer.id)) {
    return res.status(204).json()
  } else {
    return res.status(404).json({
      error: `Sorry, Producer with id ${req.params.id} doesn't exist in the database`,
    })
  }
})

module.exports = router
