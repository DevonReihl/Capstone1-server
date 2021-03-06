const express = require('express')
const path = require('path')
const MembersService =require('./members-service')

const membersRouter = express.Router()
const jsonParser = express.json()

const serializeMembers = member => ({
  id: member.id,
  gish_name: member.gish_name,
  full_name: member.full_name,
  phone: member.phone,

})

membersRouter
.route('/')
.get((req, res, next) => {
  MembersService.getAllMembers(
    req.app.get('db')
  )
  .then(members=> {
    res.json(members.map(serializeMembers))
  })
  .catch(next)
})
.post(jsonParser, (req, res, next) => {
  const {gish_name, full_name, phone} = req.body
  const newMember = { gish_name, full_name, phone}

  if (!gish_name || !full_name) {
    return res.status(400).json({
      error: {message:`Missing either gish_name or full_name in request body`}
    })
  }

  MembersService.insertMembers(
    req.app.get('db'),
    newMember
  )
  .then(member => {
    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${member.id}`))
      .json(serializeMembers(member))
  })
  .catch(next)
})

membersRouter
.route('/:memberid')
.all((req, res, next) => {
  MembersService.getById(req.app.get('db'), parseInt(req.params.memberid))
  .then(member => {
    if(!member) {
      return res.status(404).json({
        error: { message: `Member does not exist`}
      })
    }
    res.member = member
    next()
  })
  .catch(next)
})

.get((req, res, next) => {
  res.json(serializeMembers(res.member))
})
.delete((req, res, next) => {
  MembersService.deleteMember(
    req.app.get('db'),
    req.params.memberid
  )
  .then( ()=> {
    res.status(204).end()
  })
  .catch(next)
})

.patch(jsonParser, (req, res, next) => {
  const { gish_name, full_name, phone}= req.body
  const memberToUpdate = {gish_name, full_name, phone}

  const numberOfValues = Object.values(memberToUpdate). filter(Boolean).length
  if (numberOfValues === 0)
  return res.status(400).json({
    error: {
      message: `Request body must contain at least one of the following 'gish_name', 'full_name' or 'number'`
    }
  })

  MembersService.updateMember(
    req.app.get('db'),
    req.params.memberid,
    memberToUpdate
  )
  .then(()=> {
    res.status(204).end()
  })
  .catch(next)
})


module.exports = membersRouter