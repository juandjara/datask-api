const Facade = require('../../lib/facade');
const timeSchema = require('./schema');
const userFacade = require('../user/facade');
const boom = require('boom')
const objectIdValidator = require('valid-objectid')

class TimeFacade extends Facade {
  find(...args) {
    return this.Schema
      .find(...args)
  }
  findById(id, ...args) {
    if (!objectIdValidator.isValid(id)) {
      return Promise.reject(boom.badRequest('ObjectId is not valid'))
    }
    return this.Schema
      .findById(id, ...args)
      .populate([{
        path: 'task',
        select: 'name _id'
      }, {
        path: 'project',
        select: 'name _id'
      }, {
        path: 'user',
        select: 'name surname _id'
      }])
      .exec();
  }
  create(body) {
    const time = new this.Schema(body)
    return this.update(
      {endTime: null, user: body.user},
      {$set: {endTime: Date.now()}}
    )
    .then(() => time.save())
    .then(time => (
      userFacade.update(
        {_id: body.user},
        {$set: {activeTime: time._id.toString()}}
      ).then(() => time)
    ))
  }
  finish(id, body) {
    const data = {
      ...body,
      endTime: Date.now()
    }
    const userUpdate = userFacade.update(
      {_id: body.user},
      {$set: {activeTime: null}}
    )
    const timeUpdate = this.findByIdAndUpdate(id, data)
    return Promise.all([timeUpdate, userUpdate])
    .then(results => results[0])
  }
}

module.exports = new TimeFacade(timeSchema);
