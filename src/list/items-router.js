const express = require('express')
const path = require('path')
const ItemsService = require('./items-serves')

const itemsRouter = express.Router()
const jsonParser = express.json()

const serializeItems = item => ({
  id: item.id,
  item_name: item.item_name,
  item_text: item.item_text,
  item_type: item.item_type,
  points: item.points,
  member_id: item.member_id
})

itemsRouter
.route('/')
.get((req, res, next) => {
  ItemsService.getAllItems(
    req.app.get('db')
  )
  .then(items => {
    res.json(items.map(serializeItems))
  })
  .catch(next)
})
.post(jsonParser, (req, res, next) => {
  const {item_name, item_text, item_type, points, member_id}=req.body
  const newItem = {item_name, item_text, item_type, points, member_id}

  for (const [key, value] of Object.entries(newItem)) {
    if (value == null) {
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` }
      })
    }
  }
  ItemsService.insertItem(
    req.app.get('db'),
    newItem
  )
  .then(item => {
    res
    .status(201)
    .location(path.posix.join(req.originalUrl, `/${item.id}`))
    .json(serializeItems(item))
  })
  .catch(next)
})

itemsRouter
.route('/:itemid')
.all((req, res, next) => {
  ItemsService.getById(req.app.get('db'), parseInt(req.params.itemid))
  .then(item => {
    if(!item) {
      return res.status(404).json({
        error: {message: `Item does not exist`}
      })
    }
    res.item = item
    next()
  })
  .catch(next)
})

.get((req, res, next) => {
  res.json(serializeItems(res.item))
})
.delete((req, res, next) => {
  ItemsService.deleteItem(
    req.app.get('db'),
    req.params.itemid
  )
  .then( ()=> {
    res.status(204).end()
  })
  .catch(next)
})

.patch(jsonParser, (req, res, next) => {
  const {item_name, item_text, item_type, points, member_id}=req.body
  const itemToUpdate = {item_name, item_text, item_type, points, member_id}

  const numberOfValues = Object.values(itemToUpdate).filter(Boolean).length
  if (numberOfValues === 0)
  return res.status(400).json({
    error: { 
      message: `Request body must contain a value to be updated`
    }
  })

  ItemsService.updateItem(
    req.app.get('db'),
    req.params.itemid,
    itemToUpdate
  )
  .then(() => {
    res.status(204).end()
  })
  .catch(next)
})
module.exports = itemsRouter