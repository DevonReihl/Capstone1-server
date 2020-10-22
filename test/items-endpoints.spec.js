const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
// const xss = require('xss')
const app = require('../src/app')
const { makeItemsArray, makeMaliciousItem, makeReceivedItemsArray } = require('./items.fixtures')
const { makeMembersArray } = require('./members.fixtures')

describe('Item Endpoints', () => {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE hunt_items RESTART IDENTITY CASCADE'))

  afterEach('clean the table', () => db.raw('TRUNCATE hunt_items RESTART IDENTITY CASCADE'))

  describe('GET /api/items', () => {
    context(`Given no items`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/items')
          .expect(200, [])
      })
    })

    context('Given there are items in the database', () => {
      const testItems = makeItemsArray();
      // const receivedItems = makeReceivedItemsArray();

      beforeEach('insert items', () => {
        return db
          .into('hunt_items')
          .insert(testItems)
      })

      it('responds with 200 and all items', () => {
        return supertest(app)
        .get('/api/items')
        .expect(200, testItems)
      })
    })

  })

  describe('GET /api/items/:itemid', () => {
    context(`Given no items`, () => {
      it(`responds 404 the item doesn't exist`, () => {
        return supertest(app)
        .get(`/api/items/123`)
        .expect(404, {
          error: { message: `Item does not exist`}
        })
      })
    })

    context('Given there are items in the database', () => {
      const testItems = makeItemsArray();

      beforeEach('insert items', () => {
        return db
        .into('hunt_items')
        .insert(testItems)
      })


      it('responds with 200 and the specified item', () => {
        const itemId = 2
        const expectedItem = testItems[itemId - 1]
        return supertest(app)
        .get(`/api/items/${itemId}`)
        .expect(200, expectedItem)
      })
    })

  })

  describe('POST /api/items', () => {
    const requiredField = ['item_name', 'item_text', 'item_type', 'points']

    requiredField.forEach(field => {
      const newItem = {
        item_name: 'Test Name',
        item_text: 'Test text',
        item_type: 'image',
        points: 200,
      }

      it(`responds with 400 and an error mesaage when the '${field}' is missing`, () => {
        delete newItem[field]

        return supertest(app)
        .post('/api/items')
        .send(newItem)
        .expect(400, {
          error: { message: `Missing '${field}' in request body` }
        })
      })
    })
    context('create members to post item', () => {
      const testMembers = makeMembersArray()

      beforeEach('members', () => {
        return db
        .into('team_members')
        .insert(testMembers)
      })

      afterEach('clean the table', () => db.raw('TRUNCATE team_members RESTART IDENTITY CASCADE'))

      it(`Creates an item, responds with 201 and the new item`, () => {
        const newItem = {
          item_name: 'Test Name',
          item_text: 'Test text',
          item_type: 'image',
          points: 200,
          member_id: 1,
        }
        return supertest(app)
          .post('/api/items')
          .send(newItem)
          .expect(201)
          .expect(res => {
            expect(res.body.item_name).to.eql(newItem.item_name)
            expect(res.body.item_text).to.eql(newItem.item_text)
            expect(res.body.item_type).to.eql(newItem.item_type)
            expect(res.body.points).to.eql(newItem.points)
            expect(res.body.member_id).to.eql(newItem.member_id)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/items/${res.body.id}`)
          })
          .then(res => 
            supertest(app)
            .get(`/api/items/${res.body.id}`)
            .expect(res.body)
            ) 
      })
    })

    
  })

  describe(`PATCH /api/items/:itemsid`, () => {
    context('Given no items', () => {
      it('resonds with 404', () => {
        const itemId = 1029345
        return supertest(app)
        .patch(`/api/items/${itemId}`)
        .expect(404, { error: {message: `Item does not exist`}})
      })
    })
    context('Given there are items in the database', () => {
      const testItems = makeItemsArray()
      const testMembers = makeMembersArray()

      beforeEach('members', () => {
        return db
        .into('team_members')
        .insert(testMembers)
      })

      afterEach('clean the table', () => db.raw('TRUNCATE team_members RESTART IDENTITY CASCADE'))


      beforeEach('insert items', () => {
        return db
        .into('hunt_items')
        .insert(testItems)
      })
      it('responds with 204 and updates the item', () => {
        const idToUpdate = 2
        const updateItem = {
          item_name: 'Enjoy the hunt',
          item_text: 'blah blah blah',
          item_type: 'image',
          points: 0,
          member_id: 1,
        }
        return supertest(app)
        .patch(`/api/items/${idToUpdate}`)
        .send(updateItem)
        .expect(204)
      })
    })
  })

  describe('DELETE /api/items/:itemsid', () => {
    context(`Given no items`, () => {
      it(`responds 404 the item doesn't exist`, () => {
        return supertest(app)
        .delete(`/api/items/123`)
        .expect(404, {
          error: { message: `Item does not exist`}
        })
      })
    })

    context('Given there are items in the database', () => {
      const testItems = makeItemsArray()

      beforeEach('insertitem', () => {
        return db
        .into('hunt_items')
        .insert(testItems)
      })

      it('removes the item by ID', () => {
        const idToRemove = 2
        const expectedItems = testItems.filter(itm => itm.id !== idToRemove)
        return supertest(app)
        .delete(`/api/items/${idToRemove}`)
        .expect(204)
        .then(() => 
          supertest(app)
            .get(`/api/items`)
            .expect(expectedItems)
        )
      })
    })
  })
})