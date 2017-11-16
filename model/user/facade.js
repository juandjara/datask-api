const Facade = require('../../lib/facade');
const userSchema = require('./schema');
const boom = require('boom')
const objectIdValidator = require('valid-objectid')

class UserFacade extends Facade {
  findOneWithPassword(...args) {
    return this.Schema
      .findOne(...args)
      .select("+password")
      .exec();
  }
  findById(...args) {
    const id = args[0]
    if (!objectIdValidator.isValid(id)) {
      return Promise.reject(boom.badRequest('ObjectId is not valid'))
    }
    return this.Schema
      .findById(...args)
      .populate('activeTime')
      .populate('company', 'name _id')
      .exec();
  }
}

module.exports = new UserFacade(userSchema);
