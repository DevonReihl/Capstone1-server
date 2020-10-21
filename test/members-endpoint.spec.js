// const { expect } = require('chai')
// const { contentSecurityPolicy } = require('helmet')
// const knex = require('knex')
// const supertest = require('supertest')
// const xss = require('xss')
// const app = require('../src/app')
// const { makeMembersArray, makeMaliciousMember, makeReceivedMembersArray } = require('./members.fixtures')

// describe('Item Endpoints', function() {
//   let db

//   before('make knex instance', () => {
//     db = knex({
//       client: 'pg',
//       connection: process.env.TEST_DATABASE_URL
//     })
//     console.log(process.env.TEST_DATABASE_URL)
//     app.set('db', db)
//   })

//   after('disconnect from db', () => db.destroy())

//   before('clean the table', () => db.raw('TRUNCATE team_members RESTART IDENTITY CASCADE'))

//   afterEach('clean the table', () => db.raw('TRUNCATE team_members RESTART IDENTITY CASCADE'))

//   describe.only(`GET /api/members`, () => {
//     context(`Given no members`, () => {
//       it(`responds with 200 and an empty list`, () => {
//         return supertest(app)
//         .get(`/api/members`)
//         .expect(200, [])
//       })
//     })
  
//     context(`Given there are members in the database`, () => {
//       const testMembers = makeMembersArray();
  
//       beforeEach('insert members', () => {
//         return db
//         .into('team_members')
//         .insert(testMembers)
//       })

//       it(`responds with 200 and all of the members`, () => {
//         return supertest(app)
//         .get('/api/members')
//         .expect(200, testMembers)
//       })
//     })
//   })

//   describe('GET /api/members/:members_id', () => {
//     context('Given no notes', () => {
//       it(`responds with 404`, () => {
//         const memberId = 12345
//         return supertest(app)
//         .get(`/api/members/${memberId}`)
//         .expect(404, { error: { message: `Member does not exist` } })
//       })
//     })

//     context('Given there are members in the database', () => {
//       const testMembers = makeMembersArray();

//       beforeEach('insert notes', () => {
//         return db
//         .into('team_members')
//         .insert(testMembers)
//       })

//       it('responds with 200 and the specified item', () => {
//         const memberId = 2
//         const expectedMember = testMembers[memberId -1]
//         return supertest(app)
//         .get(`/api/members/${memberId}`)
//         .expect(200, expectedMember)
//       })
      
//     })
//   })
// })