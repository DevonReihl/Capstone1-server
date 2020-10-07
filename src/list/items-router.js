const express = require('express')
const path = require('path')
const ItemService = require('./items-serves')

const itemsRouter = express.Router()
const jsonParser = express.json()

const serializeItems = item => ({
  id: item.id,
  itemName: item.itemname,
  itemText: item.itemtext,
  itemType: item.itemtype,
  points: item.pointvalue,
  memberId: item.memberId
})

itemsRouter
.route('/')
.get((req, res, next) => {
  ItemService.getAllItems(
    req.app.get('db')
  )
  .then(members => )
})

module.exports = itemsRouter