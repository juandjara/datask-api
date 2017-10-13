const Facade = require('../../lib/facade');
const projectSchema = require('./schema');
const boom = require('boom')
const objectIdValidator = require('valid-objectid')

class ProjectFacade extends Facade {
  findById(id, ...args) {
    if (!objectIdValidator.isValid(id)) {
      return Promise.reject(boom.badRequest('ObjectId is not valid'))
    }
    return this.Schema
      .findById(id, ...args)
      .populate('company', 'name _id')
      .populate('manager', 'name surname _id')
      .populate('users', 'name surname _id')
      .exec();
  }
}

module.exports = new ProjectFacade(projectSchema);
