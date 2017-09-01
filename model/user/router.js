const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => controller.register(...args));

router.route('/:id')
  .put((...args) => controller.update(...args))
  .get((...args) => controller.findById(...args))
  .delete((...args) => controller.remove(...args));

router.route('/me')
  .get(controller.getPrincipal)
  .put(controller.updatePrincipal);

router.post('/login', (...args) => controller.authenticate(...args));

router.endpoint = '/user';

module.exports = router;
