import test from 'ava'
import request from 'supertest'
import MongodbMemoryServer from 'mongodb-memory-server'
import mongoose from 'mongoose'
import User from '../model/user/schema'
import Company from '../model/company/schema'

mongoose.Promise = global.Promise
process.env.NODE_ENV = 'test'
const app = require('../server')
const mongod = new MongodbMemoryServer()

const createUsers = async () => {
  const admin = new User({
    email: 'admin',
    password: 'admin',
    name: 'admin',
    roles: ["ADMIN"]
  })
  await admin.save()
  const dev = new User({
    email: 'dev',
    name: 'dev',
    password: 'dev',
    roles: ["DEVELOPER"]
  })
  await dev.save()
}
const createCompanies = async () => {
  const acme = new Company({
    name: "ACME"
  })
  await acme.save()
}
const login = async (user, pass) => {
  const res = await request(app)
    .post('/user/authenticate')
    .send({email: user, password: pass})

  return {res, token: res.body.token}
}
test.before(async () => {
  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri, {useMongoClient: true});
  await createUsers()
  await createCompanies()
})
test.after(() => {
  mongod.stop()
  mongoose.disconnect()
})

test(
  'admin should be able to list all companies',
  async t => {
    const {token} = await login('admin', 'admin')
    const res = await request(app)
      .get('/company')
      .set('Authorization', `Bearer ${token}`)

    const companies = res.body.docs
    t.is(res.status, 200)
    t.true(Array.isArray(companies))
    t.is(typeof companies[0], 'object')
    t.is(companies[0].name, 'ACME')
  }
)
test(
  'developer should be able to list all companies',
  async t => {
    const {token} = await login('dev', 'dev')
    const res = await request(app)
      .get('/company')
      .set('Authorization', `Bearer ${token}`)

    const companies = res.body.docs
    t.is(res.status, 200)
    t.true(Array.isArray(companies))
    t.is(typeof companies[0], 'object')
    t.is(companies[0].name, 'ACME')
  }
)
test('admin should be able to get a company by id', async t => {
  const {token} = await login('admin', 'admin')
  const acme = await Company.find({name: 'ACME'}).exec()

  const res = await request(app)
    .get(`/company/${acme[0]._id}`)
    .set('Authorization', `Bearer ${token}`)

  t.is(res.status, 200)
  t.is(res.body.name, 'ACME')
})
test('developer should be able to get a company by id', async t => {
  const {token} = await login('dev', 'dev')
  const acme = await Company.find({name: 'ACME'}).exec()

  const res = await request(app)
    .get(`/company/${acme[0]._id}`)
    .set('Authorization', `Bearer ${token}`)

  t.is(res.status, 200)
  t.is(res.body.name, 'ACME')
})
test('admin should be able to create a new company', async t => {
  const {token} = await login('admin', 'admin')
  const acme2 = {
    name: 'ACME2',
    address: 'Acme St.',
    type: 'CONTACT'
  }
  const res = await request(app)
    .post('/company')
    .set('Authorization', `Bearer ${token}`)
    .send(acme2)

  t.is(res.status, 201)
  t.is(typeof res.body, 'object')
  t.is(typeof res.body._id, 'string')
  t.is(res.body.name, 'ACME2')
  t.is(res.body.address, 'Acme St,')
  t.is(res.body.type, 'CONTACT')
})


test.todo('developer should not be able to create a new company')
test.todo('admin should be able to edit a company')
test.todo('developer should not be able to edit a company')
test.todo('admin should be able to delete a company')
test.todo('developer should not be able to delete a company')
