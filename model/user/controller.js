/* eslint camelcase:0 */
const Controller = require('../../lib/controller');
const userFacade = require('./facade');
const jwt = require('jsonwebtoken');
const boom = require('boom');
const {secret} = require('../../config')

class UserController extends Controller {
  register(req, res, next) {
    this.facade.create(req.body)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch(next);
  }
  checkPasswordRepeat(req, res, next) {
    const {password = "", repeat_password = ""} = req.body
    if (password.trim() !== repeat_password.trim()) {
      next(boom.badRequest('Passwords must match'))
      return
    }
    next()
  }
  authenticate(req, res, next) {
    this.facade.findOneWithPassword({ email: req.body.email })
      .then((user) => {
        if (!user ||
            !user.activated ||
            !user.comparePassword(req.body.password)) {
          return next(boom.unauthorized('Wrong credentials'))
        }
        const {email, full_name, roles, _id} = user
        const payload = {email, full_name, roles, _id}
        const token = jwt.sign(payload, secret, {expiresIn: '1d'});
        res.json({ token });
      })
      .catch(next);
  }
  getPrincipal(req, res, next) {
    const userId = req.user._id;
    this.facade.findById(userId)
      .then((user) => {
        if (!user) {
          return next(boom.notFound('user not found'))
        }
        res.json(user);
      })
      .catch(next);
  }
  updatePrincipal(req, res, next) {
    const userId = req.user._id;
    this.facade.findByIdAndUpdate(userId, req.body)
      .then(user => res.json(user))
      .catch(next)
  }
}

module.exports = new UserController(userFacade);
