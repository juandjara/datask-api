const Facade = require('../../lib/facade');
const timeSchema = require('./schema');
const userFacade = require('../user/facade');

class TimeFacade extends Facade {
  create(body) {
    const time = new this.Schema(body)
    const userUpdate = userFacade.update(
      {_id: body.user},
      {$set: {activeTimeStart: time.startTime, activeTask: body.task}}
    )
    return Promise.all([time.save(), userUpdate])
  }
  finish(id, body) {
    const data = {
      ...body,
      endTime: Date.now()
    }
    const userUpdate = userFacade.update(
      {_id: body.user},
      {$set: {activeTimeStart: null, activeTask: null}}
    )
    const timeUpdate = this.Schema.findByIdAndUpdate(id, data)
    return Promise.all([timeUpdate, userUpdate])
  }
}

module.exports = new TimeFacade(timeSchema);
