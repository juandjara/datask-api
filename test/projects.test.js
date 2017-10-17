import test from 'ava'
import request from 'supertest'
import MongodbMemoryServer from 'mongodb-memory-server'
import mongoose from 'mongoose'
import User from '../model/user/schema'
import Project from '../model/project/schema'

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
const createProjects = async () => {
  const user = await User.find({email: 'dev'}).exec()
  const opk = new Project({
    name: "Opileak",
    status: "ACTIVE",
    manager: user._id
  })
  await opk.save()
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
  await createProjects()
})
test.after(() => {
  mongod.stop()
  mongoose.disconnect()
})

test(
  'admin should be able to list all project',
  async t => {
    const {token} = await login('admin', 'admin')
    const res = await request(app)
      .get('/project')
      .set('Authorization', `Bearer ${token}`)

    const projects = res.body.docs
    t.is(res.status, 200)
    t.true(Array.isArray(projects))
    t.is(typeof projects[0], 'object')
    t.is(projects[0].name, 'Opileak')
  }
)
test(
  'developer should be able to list all project',
  async t => {
    const {token} = await login('dev', 'dev')
    const res = await request(app)
      .get('/project')
      .set('Authorization', `Bearer ${token}`)

    const projects = res.body.docs
    t.is(res.status, 200)
    t.true(Array.isArray(projects))
    t.is(typeof projects[0], 'object')
    t.is(projects[0].name, 'Opileak')
  }
)

test.todo('admin should be able to get a project by id')
test.todo('developer should be able to get a project by id')
test.todo('admin should be able to create a new project')
test.todo('developer should be able to create a new project')
test.todo('admin should be able to edit a project')
test.todo('manager should be able to edit a project')
test.todo('developer should not be able to edit a project')
test.todo('admin should be able to delete a project')
test.todo('manager should be able to edit a project')
test.todo('developer should not be able to delete a project')
