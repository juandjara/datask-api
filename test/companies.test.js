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

test.todo('admin should be able to get a company by id')
test.todo('developer should be able to get a company by id')
test.todo('admin should be able to create a new company')
test.todo('developer should not be able to create a new company')
test.todo('admin should be able to edit a company')
test.todo('developer should not be able to edit a company')
test.todo('admin should be able to delete a company')
test.todo('developer should not be able to delete a company')
