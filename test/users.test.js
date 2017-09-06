import test from 'ava'
import request from 'supertest'
import MongodbMemoryServer from 'mongodb-memory-server'
import mongoose from 'mongoose'
import User from '../model/user/schema'

let app
const mongod = new MongodbMemoryServer()

const createTestUsers = async () => {
  const admin = new User({
    email: 'admin',
    password: 'admin',
    full_name: 'admin',
    roles: ["ADMIN"]
  })
  await admin.save()
  const dev = new User({
    email: 'dev',
    full_name: 'dev',
    password: 'dev',
    roles: ["DEVELOPER"]
  })
  await dev.save()
}

test.before(async () => {
  const uri = await mongod.getConnectionString();
  process.env.MONGO_DB_URI = uri
  process.env.NODE_ENV = 'test'

  app = require('../index')

  await mongoose.connect(uri, {useMongoClient: true});
  await createTestUsers()
});

const login = async (user, pass) => {
  const res = await request(app)
    .post('/user/login')
    .send({email: user, password: pass})

  return {res, token: res.body.token}
}
const getMyself = async (token) => {
  const userRes = await request(app)
    .get('/user/me')
    .set('Authorization', `Bearer ${token}`)
  return userRes.body
}
const isValidISODateString = isoDateStr => !isNaN(Date.parse(isoDateStr))

test(
  'anonymous user should be able to login with email and password', 
  async t => {
    const {res, token} = await login('admin', 'admin')
    t.is(res.status, 200)
    t.is(typeof token, 'string')
  }
)
test(
  'logged user should be able to get his data',
  async t => {
    const {token} = await login('admin', 'admin')
    const user = await getMyself(token)

    t.is(user.email, 'admin')
    t.is(user.full_name, 'admin')
    t.true(Array.isArray(user.roles))
    t.is(user.roles[0], 'ADMIN')
    t.true(isValidISODateString(user.created_at))
    t.is(typeof user._id, 'string')
    t.falsy(user.password)
  }
)
test(
  'admin should be able to list all users',
  async t => {
    const {token} = await login('admin', 'admin')
    const res = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`)

    t.is(res.status, 200)
    const users = res.body
    t.true(Array.isArray(users))
    t.is(typeof users[0], 'object')

    t.is(users[0].email, 'admin')
    t.is(users[1].email, 'dev')
  }
)
test(
  'developer should not be able to list all users',
  async t => {
    const {token} = await login('dev', 'dev')
    const res = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`)

    t.is(res.status, 403)
    t.is(res.body.error, 'Permission denied')
  }
)

test(
  'logged user should be able to modify his/her data',
  async t => {
    const {token} = await login('admin', 'admin')
    const initialUser = await getMyself(token)

    const res = await request(app)
      .put('/user/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'not admin' })

    t.is(res.status, 200)
    t.not(initialUser.email, res.body.email)
    t.is(res.body.email, 'not admin')
    t.falsy(res.body.password)
  }
)
test(
  'admin should be able to create a new user',
  async t => {
    const {token} = await login('admin', 'admin')
    const newUser = {
      email: 'user 3',
      password: 'user 3',
      full_name: 'user 3'
    }
    const res = await request(app)
      .post('/user')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)

    t.is(res.status, 201)

    const user = res.body
    t.is(typeof user, 'object')
    t.is(typeof user._id, 'string')
    t.is(user.email, newUser.email)
    t.is(user.full_name, newUser.full_name)
    t.true(isValidISODateString(user.created_at))
    t.falsy(user.password)
  }
)

test(
  'developer should not be able to create a new user',
  async t => {
    const {token} = await login('dev', 'dev')
    const newUser = {
      email: 'user 3',
      password: 'user 3',
      full_name: 'user 3'
    }
    const res = await request(app)
      .post('/user')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)

    t.is(res.status, 403)
    t.is(res.body.error, 'Permission denied')
  }
)

test(
  'admin should be able to get any user by id',
  async t => {
    const {token} = await login('admin', 'admin')
    const user = await User.find({email: 'dev'}).exec()

    const res = await request(app)
      .get(`/user/${user[0]._id}`)
      .set('Authorization', `Bearer ${token}`)

    t.is(res.status, 200)
    t.is(JSON.stringify(res.body), JSON.stringify(user[0]))
  }
)
test(
  'developer should not be able to get any user by id',
  async t => {
    const {token} = await login('dev', 'dev')
    const user = await User.find({email: 'dev'}).exec()

    const res = await request(app)
      .get(`/user/${user[0]._id}`)
      .set('Authorization', `Bearer ${token}`)

    t.is(res.status, 403)
    t.is(res.body.error, 'Permission denied')
  }
)

test(
  'admin should be able to edit any user by id',
  async t => {
    const {token} = await login('admin', 'admin')
    const user = await User.find({email: 'dev'}).exec()

    const res = await request(app)
      .put(`/user/${user[0]._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({full_name: 'dev edited'})

    t.is(res.status, 200)
    t.not(user.full_name, res.body.full_name)
    t.is(res.body.full_name, 'dev edited')
  }
)
test(
  'developer should not be able to edit any user by id',
  async t => {
    const {token} = await login('dev', 'dev')
    const user = await User.find({email: 'dev'}).exec()

    const res = await request(app)
      .put(`/user/${user[0]._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({full_name: 'dev edited'})

    t.is(res.status, 403)
    t.is(res.body.error, 'Permission denied')
  }
)

test(
  'admin should be able to delete any user by id',
  async t => {
    const {token} = await login('admin', 'admin')
    const user = await User.find({email: 'dev'}).exec()

    const res = await request(app)
      .delete(`/user/${user[0]._id}`)
      .set('Authorization', `Bearer ${token}`)

    t.is(res.status, 200)
  }
)
test(
  'developer should not be able to delete any user by id',
  async t => {
    const {token} = await login('dev', 'dev')
    const user = await User.find({email: 'dev'}).exec()

    const res = await request(app)
      .delete(`/user/${user[0]._id}`)
      .set('Authorization', `Bearer ${token}`)

    t.is(res.status, 403)
  }
)

test.afterEach.always(() => {
  User.remove({})
})
