const Facade = require('../../lib/facade');
const taskSchema = require('./schema');
const boom = require('boom')
const objectIdValidator = require('valid-objectid')

class TaskFacade extends Facade {
  findById(...args) {
    const id = args[0]
    if (!objectIdValidator.isValid(id)) {
      return Promise.reject(boom.badRequest('ObjectId is not valid'))
    }
    return this.Schema
      .findById(...args)
      .populate('asignee', 'name surname _id')
      .exec();
  }
}

module.exports = new TaskFacade(taskSchema);
