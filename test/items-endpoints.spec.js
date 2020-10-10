const { expect } = require('chai')
const { contentSecurityPolicy } = require('helmet')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeItemsArray, makeMaliciousItem, makeReceivedItemsArray } = require('./items.fixtures')

describe('Item Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    console.log(process.env.TEST_DATABASE_URL)
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE hunt_items RESTART IDENTITY CASCADE'))

  afterEach('clean the table', () => db.raw('TRUNCATE hunt_items RESTART IDENTITY CASCADE'))

  describe(`GET /api/items`, () => {
    context(`Given no items`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
        .get(`/api/items`)
        .expect(200, [])
      })
    })
  
    context(`Given there are items in the database`, () => {
      const testItems = makeItemsArray();
      const receivedItems = makeReceivedItemsArray();
      beforeEach('insert items', () => {
        return db
        .into('hunt_items')
        .insert(testItems)
      })

      it(`responds with 200 and all of the items`, () => {
        return supertest(app)
        .get('/api/items')
        .expect(200, receivedItems)
      })
    })
  })

  describe('GET /api/items/:items_id', () => {
    context('Given no notes', () => {
      it(`responds with 404`, () => {
        const itemId = 12345
        return supertest(app)
        .get(`/api/items/${itemId}`)
        .expect(404, { error: { message: `Item does not exist` } })
      })
    })

    context('Given there are items in the database', () => {
      const testItems = makeItemsArray();
      const receivedItems = makeReceivedItemsArray();

      beforeEach('insert notes', () => {
        return db
        .into('hunt_items')
        .insert(testItems)
      })

      it('responds with 200 and the specified item', () => {
        const itemId = 2
        const expectedItem = receivedItems[itemId -1]
        return supertest(app)
        .get(`/api/items/${itemId}`)
        .expect(200, expectedItem)
      })
      
    })
  })
})