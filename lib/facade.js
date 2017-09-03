const boom = require('boom')

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
}

module.exports = Facade;
