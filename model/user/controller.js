const Controller = require('../../lib/controller');
const userFacade = require('./facade');
const jwt = require('jsonwebtoken');
const boom = require('boom');

class UserController extends Controller {
  register(req, res, next) {
    this.facade.create(req.body)
      .then((doc) => {
        res.status(201).json(doc);
      })
      .catch(err => next(boom.wrap(err, 400)));
  }
  authenticate(req, res, next) {
    this.facade.findOneWithPassword({ email: req.body.email })
      .then((user) => {
        if (!user || !user.comparePassword(req.body.password)) {
          return res.status(401).json({ error: 'Access denied. Wrong credentials' });
        }
        delete user._doc.hashed_password
        const token = jwt.sign(user._doc, 'mega_token_secret', {expiresIn: '1d'});
        res.json({ token });
      })
      .catch(next);
  }
  getPrincipal(req, res, next) {
    const userId = req.user._id;
    this.facade.findById(userId)
      .then((user) => {
        if (!user) {
          throw boom.notFound('user not found')
        }
        return res.json(user);
      })
      .catch(next);
  }
  updatePrincipal(req, res, next) {
    const userId = req.user._id;
    this.facade.updateById(userId, req.body)
      .then(user => res.json(user))
      .catch(err => next(boom.wrap(err, 400)));
  }
}

module.exports = new UserController(userFacade);
