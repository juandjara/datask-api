const Controller = require('../../lib/controller');
const userFacade = require('./facade');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController extends Controller {
  register(req, res, next) {
    req.body.hashed_password = bcrypt.hashSync(req.body.password, 10);
    this.facade.create(req.body)
      .then((doc) => {
        delete doc.hashed_password;
        res.status(201).json(doc);
      })
      .catch(err => next(err));
  }
  authenticate(req, res, next) {
    this.facade.findOneWithPassword({ email: req.body.email })
      .then((user) => {
        if (!user || !user.comparePassword(req.body.password)) {
          return res.status(401).json({ error: 'Access denied. Wrong credentials' });
        }
        const token = jwt.sign({
          email: user.email,
          fullName: user.fullName
        }, 'mega_token_secret');
        res.json({ token });
      })
      .catch(next);
  }
  getPrincipal(req, res, next) {
    const userId = req.user.id;
    this.facade.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({error: 'User not found'})
        }
        return res.json(user);
      })
      .catch(next);
  }
  updatePrincipal(req, res, next) {
    const userId = req.user.id;
    this.facade.update({ _id: userId }, req.body)
      .then((results) => {
        if (results.n < 1) { return res.status(404).json({error: 'User not found'}); }
        if (results.nModified < 1) { return res.sendStatus(304); }
        res.sendStatus(204);
      })
      .catch(next);
  }
}

module.exports = new UserController(userFacade);
