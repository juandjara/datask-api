const Facade = require('../../lib/facade');
const timeSchema = require('./schema');
const userFacade = require('../user/facade');

class TimeFacade extends Facade {
  create(body) {
    const timePromise = new this.Schema(body).save();
    const userPromise = userFacade.findByIdAndUpdate(body.user, {activeTask: body.task})
    return Promise.all([timePromise, userPromise])
  }
  finish(id, body) {
    const data = {
      ...body,
      endTime: Date.now()
    }
    const userPromise = userFacade.findByIdAndUpdate(body.user, {activeTask: null})
    const timePromise = this.Schema.findByIdAndUpdate(id, data)
    return Promise.all([timePromise, userPromise])
  }
}

module.exports = new TimeFacade(timeSchema);
