const { expect } = require('chai')
const { contentSecurityPolicy } = require('helmet')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeItemsArray, makeMaliciousItem } = require('./items.fixtures')

describe.only('Item Endpoints', function() {
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

      beforeEach('insert items', () => {
        return db
        .into('hunt_items')
        .insert(testItems)
      })

      it(`responds with 200 and all of the items`, () => {
        return supertest(app)
        .get('api/items')
        .expect(200, testItems)
      })
    })
  })
})