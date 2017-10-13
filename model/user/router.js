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

router.use(checkAdmin)

router.route('/')
  .get((...args) => controller.paginate(...args))
  .post(checkPasswordRepeat, (...args) => controller.register(...args));

router.route('/:id')
  .put(checkPasswordRepeat, (...args) => controller.update(...args))
  .get((...args) => controller.findById(...args))
  .delete((...args) => controller.remove(...args));


router.endpoint = '/user';

module.exports = router;
