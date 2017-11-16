const Facade = require('../../lib/facade');
const timeSchema = require('./schema');
const userFacade = require('../user/facade');

class TimeFacade extends Facade {
  create(body) {
    const time = new this.Schema(body)
    return time.save()
    .then(time => {
      userFacade.update(
        {_id: body.user},
        {$set: {activeTime: time._id.toString()}}
      , (err) => {
        if (err) {
          Promise.reject(err)
        }
      })
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
    const timeUpdate = this.Schema.findByIdAndUpdate(id, data)
    return Promise.all([timeUpdate, userUpdate])
  }
}

module.exports = new TimeFacade(timeSchema);
