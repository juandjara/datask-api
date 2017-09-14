const Controller = require('../../lib/controller');
const userFacade = require('./facade');
const jwt = require('jsonwebtoken');
const boom = require('boom');

class UserController extends Controller {
  register(req, res, next) {
    this.facade.create(req.body)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch(next);
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
        const token = jwt.sign(payload, 'mega_token_secret', {expiresIn: '1d'});
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
