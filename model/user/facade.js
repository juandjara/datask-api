const Facade = require('../../lib/facade');
const userSchema = require('./schema');

class UserFacade extends Facade {
  findOneWithPassword(...args) {
    return this.Schema
      .findOne(...args)
      .select("+password")
      .exec();
  }
}

module.exports = new UserFacade(userSchema);
