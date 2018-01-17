const Facade = require('../../lib/facade');
const timeSchema = require('./schema');
const userFacade = require('../user/facade');
const boom = require('boom')
const objectIdValidator = require('valid-objectid')
const { Types } = require('mongoose')
const moment = require('moment');

class TimeFacade extends Facade {
  find(...args) {
    return this.Schema
      .find(...args)
  }
  findById(id, ...args) {
    if (!objectIdValidator.isValid(id)) {
      return Promise.reject(boom.badRequest('ObjectId is not valid'))
    }
    return this.Schema
      .findById(id, ...args)
      .populate([{
        path: 'task',
        select: 'name _id'
      }, {
        path: 'project',
        select: 'name _id'
      }, {
        path: 'user',
        select: 'name surname _id'
      }])
      .exec();
  }
  create(body) {
    const time = new this.Schema(body)
    return this.update(
      {endTime: null, user: body.user},
      {$set: {endTime: Date.now()}}
    )
    .then(() => time.save())
    .then(time => (
      userFacade.update(
        {_id: body.user},
        {$set: {activeTime: time._id.toString()}}
      ).then(() => time)
    ))
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
  getTotalTimes(userId) {
    const user = new Types.ObjectId(userId);
    const today = moment();
    const prevMonth = moment().subtract(1, 'month').toDate();
    return this.Schema.find({
      user,
      startTime: {$gte: prevMonth}
    })
    .exec()
    .then(times => times.map(t => t.toJSON()))
    .then(times => times.map(t => ({
      ...t,
      endTime: new Date(t.endTime),
      startTime: new Date(t.startTime)
    })))
    .then(times => times.map(t => ({
      ...t,
      totalTime: moment(t.endTime).diff(t.startTime, 'seconds')
    })))
    .then(times => {
      const dayTotalTime = times.filter(t => (
        moment(t.startTime).isSame(today, 'day')
      ))
      .map(t => t.totalTime)
      .reduce((prev, next) => prev + next, 0)

      const weekTotalTime = times.filter(t => (
        moment(t.startTime).isSame(today, 'week')
      ))
      .map(t => t.totalTime)
      .reduce((prev, next) => prev + next, 0)

      const monthTotalTime = times.reduce((prev, next) => (
        prev + next.totalTime
      ), 0)

      return {
        dayTotalTime, weekTotalTime, monthTotalTime
      }
    })
  }
  groupedByTask(userId) {
    return this.Schema.aggregate([
      {$match: {user: new Types.ObjectId(userId)}},
      {$sort: {startTime: -1}},
      {
        $lookup: {
          from: 'tasks',
          localField: 'task',
          foreignField: '_id',
          as: 'task'
        }
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'project'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {$unwind: '$task'},
      {$unwind: '$project'},
      {$unwind: '$user'},
      {
        $project: {
          task: {
            _id: 1,
            name: 1
          },
          project: {
            _id: 1,
            name: 1
          },
          user: {
            _id: 1,
            name: 1,
            surname: 1
          },
          startTime: 1,
          endTime: 1
        }
      },
      {
        $group: {
          _id: '$task._id',
          times: {
            $push: '$$ROOT'
          }
        }
      },
      {
        $project: {
          times: {
            $arrayElemAt: ["$times", 0]
          }
        }
      },
      {$sort: {'times.startTime': -1}},
      {$replaceRoot: {newRoot: '$times'}},
      {$limit: 5}
    ])
  }
  groupedByProject(userId, startDate, endDate) {
    const user = new Types.ObjectId(userId);
    return this.Schema.aggregate([
      {
        $match: {
          user,
          startTime: {
            $gt: new Date(startDate),
            $lt: new Date(endDate)
          }
        }
      },
      {$sort: {startTime: 1}},
      {
        $lookup: {
          from: 'tasks',
          localField: 'task',
          foreignField: '_id',
          as: 'task'
        }
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'project'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {$unwind: '$task'},
      {$unwind: '$project'},
      {$unwind: '$user'},
      {
        $project: {
          task: {
            _id: 1,
            name: 1
          },
          project: {
            _id: 1,
            name: 1
          },
          user: {
            _id: 1,
            name: 1,
            surname: 1
          },
          startTime: 1,
          endTime: 1
        }
      },
      {
        $group: {
          _id: '$project._id',
          times: {$push: '$$ROOT'},
          totalTime: {
            $sum: {$subtract: ['$endTime', '$startTime']}
          }
        }
      }
    ]);
  }
}

module.exports = new TimeFacade(timeSchema);
