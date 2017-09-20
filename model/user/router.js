const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();
const jwtRoles = require('express-jwt-permissions')({
  permissionsProperty: 'roles'
})

const checkPasswordRepeat = controller.checkPasswordRepeat.bind(controller)

router.route('/')
  .get(jwtRoles.check('ADMIN'), (...args) => controller.paginate(...args))
  .post(jwtRoles.check('ADMIN'),
        checkPasswordRepeat,
        (...args) => controller.register(...args));

router.route('/me')
  .get((...args) => controller.getPrincipal(...args))
  .put(checkPasswordRepeat, (...args) => controller.updatePrincipal(...args));

router.route('/:id')
  .put(jwtRoles.check('ADMIN'),
       checkPasswordRepeat,
       (...args) => controller.update(...args))
  .get(jwtRoles.check('ADMIN'), (...args) => controller.findById(...args))
  .delete(jwtRoles.check('ADMIN'), (...args) => controller.remove(...args));

router.post('/authenticate', (...args) => controller.authenticate(...args));

router.endpoint = '/user';

module.exports = router;
