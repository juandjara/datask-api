const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();
const jwtRoles = require('express-jwt-permissions')({
  permissionsProperty: 'roles'
})

const checkAdmin = jwtRoles.check('ADMIN')

router.route('/')
  .get((...args) => controller.paginate(...args))
  .post(checkAdmin, (...args) => controller.create(...args));

router.route('/:id')
  .get((...args) => controller.findById(...args))
  .put(checkAdmin, (...args) => controller.update(...args))
  .delete(checkAdmin, (...args) => controller.remove(...args));

router.endpoint = "/company"

module.exports = router;
