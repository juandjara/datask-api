const Controller = require('../../lib/controller');
const timeFacade = require('./facade');
const boom = require('boom')

class TimeController extends Controller {
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
    const timeUserId = req.body.user || req.params.userId
    const currentUserId = req.user._id
    if (timeUserId !== currentUserId) {
      next(boom.forbidden('You must owner of this time or ADMIN to perform this action'))
      return
    }
    next()
  }
}

module.exports = new TimeController(timeFacade);
