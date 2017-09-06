const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();
const jwtRoles = require('express-jwt-permissions')({
  permissionsProperty: 'roles'
})

router.route('/')
  .get(jwtRoles.check('ADMIN'), (...args) => controller.find(...args))
  .post(jwtRoles.check('ADMIN'), (...args) => controller.register(...args));

router.route('/me')
  .get(controller.getPrincipal.bind(controller))
  .put(controller.updatePrincipal.bind(controller));

router.route('/:id')
  .put(jwtRoles.check('ADMIN'), (...args) => controller.update(...args))
  .get(jwtRoles.check('ADMIN'), (...args) => controller.findById(...args))
  .delete(jwtRoles.check('ADMIN'), (...args) => controller.remove(...args));

router.post('/login', (...args) => controller.authenticate(...args));

router.endpoint = '/user';

module.exports = router;
