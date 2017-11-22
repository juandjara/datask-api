const Facade = require('../../lib/facade');
const timeSchema = require('./schema');
const userFacade = require('../user/facade');

class TimeFacade extends Facade {
  create(body) {
    const time = new this.Schema(body)
    return this.update(
      {endTime: null, user: body.user},
      {$set: {endTime: Date.now()}}
    )
    .then(() => time.save())
    .then(time => {
      userFacade.update(
        {_id: body.user},
        {$set: {activeTime: time._id.toString()}}
      )
      return time
    })
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
