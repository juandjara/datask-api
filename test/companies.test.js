import test from 'ava'
import request from 'supertest'
import MongodbMemoryServer from 'mongodb-memory-server'
import mongoose from 'mongoose'
import User from '../model/user/schema'

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
})
test.after(() => {
  mongod.stop()
  mongoose.disconnect()
})

test(
  'admin should list all companies',
  async t => {
    const {token} = await login('admin', 'admin')
    const res = await request(app)
      .get('/company')
      .set('Authorization', `Bearer ${token}`)

    t.is(res.status, 200)
    t.true(Array.isArray(res.body.docs))
  }
)
test(
  'developer should list all companies',
  async t => {
    const {token} = await login('dev', 'dev')
    const res = await request(app)
      .get('/company')
      .set('Authorization', `Bearer ${token}`)

    t.is(res.status, 200)
    t.true(Array.isArray(res.body.docs))
  }
)
