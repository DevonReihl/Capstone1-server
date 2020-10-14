const express = require('express')
const path = require('path')
const ItemsService = require('./items-serves')

const itemsRouter = express.Router()
const jsonParser = express.json()

const serializeItems = item => ({
  id: item.id,
  itemName: item.itemname,
  itemText: item.itemtext,
  itemType: item.itemtype,
  points: item.points,
  memberId: item.memberid
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
  const {itemname, itemtext, itemtype, points, memberid}=req.body
  const newItem = {itemname, itemtext, itemtype, points, memberid}

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
  const {itemname, itemtext, itemtype, points, memberid}=req.body
  const itemToUpdate = {itemname, itemtext, itemtype, points, memberid}

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