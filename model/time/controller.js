const Controller = require('../../lib/controller');
const timeFacade = require('./facade');
const boom = require('boom')

class TimeController extends Controller {
  finish(req, res, next) {
    this.facade.finish(req.params.id, req.body)
      .then(doc => res.json(doc))
      .catch(err => next(err))
  }
  findByTask(req, res, next) {
    const {sort = '-startTime', page = 0, size = 5} = req.query
    const query = {
      task: req.params.taskId
    }
    const populate = [{
      path: 'task',
      select: 'name _id'
    }, {
      path: 'project',
      select: 'name _id'
    }, {
      path: 'user',
      select: 'name surname _id'
    }]
    return this.facade.paginate(page, size, sort, query, populate)
    .then(pageDataMapped => res.json(pageDataMapped))
    .catch(next)
  }
  findByUser(req, res, next) {
    const isAdmin = req.user.roles.indexOf("ADMIN") !== -1
    const user = isAdmin ? req.params.userId : req.user._id
    const {sort = '-startTime', size = 5} = req.query
    const query = {user}
    const populate = [{
      path: 'task',
      select: 'name _id'
    }, {
      path: 'project',
      select: 'name _id'
    }, {
      path: 'user',
      select: 'name surname _id'
    }]
    return this.facade
    .find(query)
    .limit(size)
    .sort(sort)
    .populate(populate)
    // .paginate(page, size, sort, query, populate)
    .exec()
    .then(times => res.json(times))
    .catch(next)
  }
  userIsOwner(req, res, next) {
    const {roles} = req.user
    const isAdmin = roles.indexOf("ADMIN") !== -1
    const isDeveloper = roles.indexOf("DEVELOPER") !== -1

    if (isAdmin) {
      next()
      return
    }
    if (!isDeveloper) {
      next(boom.forbidden("You must be ADMIN or DEVELOPER to perform this action"))
      return
    }
    const timeId = req.body._id || req.params.id
    const currentUserId = req.user._id
    this.facade.findById(timeId)
    .then(time => {
      if (time.user.toString() !== currentUserId) {
        next(boom.forbidden('You must be owner of this time or ADMIN to perform this action'))
        return
      }
      next()
    }).catch(next)
  }
}

module.exports = new TimeController(timeFacade);
