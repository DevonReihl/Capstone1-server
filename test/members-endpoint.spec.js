const { expect } = require('chai')
const { contentSecurityPolicy } = require('helmet')
const knex = require('knex')
const supertest = require('supertest')
const xss = require('xss')
const app = require('../src/app')
const { makeMembersArray, makeMaliciousMember, makeReceivedMembersArray } = require('./members.fixtures')

describe('Members Endpoints', function() {
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

  before('clean the table', () => db.raw('TRUNCATE team_members RESTART IDENTITY CASCADE'))

  afterEach('clean the table', () => db.raw('TRUNCATE team_members RESTART IDENTITY CASCADE'))

  describe(`GET /api/members`, () => {
    context(`Given no members`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
        .get(`/api/members`)
        .expect(200, [])
      })
    })
  
    context(`Given there are members in the database`, () => {
      const testMembers = makeMembersArray();
  
      beforeEach('insert members', () => {
        return db
        .into('team_members')
        .insert(testMembers)
      })

      it(`responds with 200 and all of the members`, () => {
        return supertest(app)
        .get('/api/members')
        .expect(200, testMembers)
      })
    })
  })

  describe('GET /api/members/:members_id', () => {
    context('Given no notes', () => {
      it(`responds with 404`, () => {
        const memberId = 12345
        return supertest(app)
        .get(`/api/members/${memberId}`)
        .expect(404, { error: { message: `Member does not exist` } })
      })
    })

    context('Given there are members in the database', () => {
      const testMembers = makeMembersArray();

      beforeEach('members', () => {
        return db
        .into('team_members')
        .insert(testMembers)
      })

      it('responds with 200 and the specified member', () => {
        const memberId = 2
        const expectedMember = testMembers[memberId -1]
        return supertest(app)
        .get(`/api/members/${memberId}`)
        .expect(200, expectedMember)
      })
      
    })
  })

  describe('POST /api/members', () => {
    const requiredField = ['gish_name', 'full_name']

    requiredField.forEach(field => {
      const newMember = {
        gish_name: 'Test gishname',
        full_name: 'Test fullname',
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newMember[field]

        return supertest(app)
        .post('/api/members')
        .send(newMember)
        .expect(400, {
          error: { message: `Missing either gish_name or full_name in request body` }
        })
      })
    })
  
      it(`Creates a member, responds with 201 and the new member`, () => {
        const newMember = {
          gish_name: 'Test Gishname',
          full_name: 'Test Fullname',
          phone: '555-555-5555',
          
        }
        return supertest(app)
          .post('/api/members')
          .send(newMember)
          .expect(201)
          .expect(res => {
            expect(res.body.gish_name).to.eql(newMember.gish_name)
            expect(res.body.full_name).to.eql(newMember.full_name)
            expect(res.body.phone).to.eql(newMember.phone)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/members/${res.body.id}`)
          })
          .then(res => 
            supertest(app)
            .get(`/api/members/${res.body.id}`)
            .expect(res.body)
            ) 
      })

    
  })

  describe('DELETE /api/members/:members_id', () => {
    context(`Given no members`, () => {
      it(`responds 404 the member doesn't exist`, () => {
        return supertest(app)
        .delete(`/api/members/123`)
        .expect(404, {
          error: { message: `Member does not exist`}
        })
      })
    })

    context('Given there are members in the database', () => {
      const testMembers = makeMembersArray()

      beforeEach('insertmember', () => {
        return db
        .into('team_members')
        .insert(testMembers)
      })

      it('removes the member by ID', () => {
        const idToRemove = 2
        const expectedMembers = testMembers.filter(itm => itm.id !== idToRemove)
        return supertest(app)
        .delete(`/api/members/${idToRemove}`)
        .expect(204)
        .then(() => 
          supertest(app)
            .get(`/api/members`)
            .expect(expectedMembers)
        )
      })
    })
  })

  describe(`PATCH /api/members/:members_id`, () => {
    context(`Given no Members`, () => {
      it(`responds with 404`, () => {
        const memberId = 1234
        return supertest(app)
        .patch(`/api/members/${memberId}`)
        .expect(404, { error: { message: `Member does not exist` } })
      })
    })

    context('Given there are members in the database', () => {
      const testMembers = makeMembersArray()

      beforeEach('insert members', () => {
        return db
        .into('team_members')
        .insert(testMembers)
      })

      it('responds with 204 and update the member', () => {
        const idToUpdate = 2
        const updateMember = {
          gish_name: 'Gish Name',
          full_name: 'Full Name',
          phone: '555-444-5555'
        }

        return supertest(app)
        .patch(`/api/members/${idToUpdate}`)
        .send(updateMember)
        .expect(204)
      })
    })
  })
})