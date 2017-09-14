const Facade = require('../../lib/facade');
const companySchema = require('./schema');
const boom = require('boom')
const objectIdValidator = require('valid-objectid')

class CompanyFacade extends Facade {
  findById(...args) {
    const id = args[0]
    if (!objectIdValidator.isValid(id)) {
      return Promise.reject(boom.badRequest('ObjectId is not valid'))
    }
    return this.Schema
      .findById(...args)
      .populate('users')
      .exec();
  }
}

module.exports = new CompanyFacade(companySchema);
