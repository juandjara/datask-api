const boom = require('boom')
const objectIdValidator = require('valid-objectid')

class Facade {
  constructor(Schema) {
    this.Schema = Schema;
  }

  create(body) {
    const schema = new this.Schema(body);
    return schema.save();
  }

  find(...args) {
    return this.Schema
      .find(...args)
      .exec();
  }

  findOne(...args) {
    return this.Schema
      .findOne(...args)
      .exec();
  }

  findById(...args) {
    const id = args[0]
    if (!objectIdValidator.isValid(id)) {
      return Promise.reject(boom.badRequest('ObjectId is not valid'))
    }
    return this.Schema
      .findById(...args)
      .exec();
  }

  update(...args) {
    return this.Schema
      .update(...args)
      .exec();
  }

  findByIdAndUpdate(id, body) {
    return this.Schema
      .findById(id)
      .exec()
      .then((item) => {
        if (!item) {
          return Promise.reject(boom.notFound('Entity not found'))
        }
        Object.assign(item, body)
        return item.save()
      })
  }

  remove(...args) {
    return this.Schema
      .remove(...args)
      .exec();
  }

  paginate(query, options) {
    return this.Schema
      .paginate(query, options)
  }
}

module.exports = Facade;
