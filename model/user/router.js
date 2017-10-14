const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();
const jwtRoles = require('express-jwt-permissions')({
  permissionsProperty: 'roles'
})

const checkPasswordRepeat = controller.checkPasswordRepeat.bind(controller)
const checkAdmin = jwtRoles.check('ADMIN')

router.post('/authenticate', (...args) => controller.authenticate(...args));

router.route('/me')
  .get((...args) => controller.getPrincipal(...args))
  .put(checkPasswordRepeat, (...args) => controller.updatePrincipal(...args));

router.route('/')
  .get((...args) => controller.paginate(...args))
  .post(checkAdmin, checkPasswordRepeat, (...args) => controller.register(...args));

router.route('/:id')
  .get((...args) => controller.findById(...args))
  .put(checkAdmin, checkPasswordRepeat, (...args) => controller.update(...args))
  .delete(checkAdmin, (...args) => controller.remove(...args));


router.endpoint = '/user';

module.exports = router;
