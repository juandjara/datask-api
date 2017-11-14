const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();
const jwtRoles = require('express-jwt-permissions')({
  permissionsProperty: 'roles'
})

const checkAdmin = jwtRoles.check('ADMIN')
const checkPermission = controller.userIsManager.bind(controller)

router.route('/')
  .get(checkAdmin, (...args) => controller.paginate(...args))
  .post((...args) => controller.create(...args));

router.get('/by_principal',
           (...args) => controller.findByCurrentUser(...args))

router.route('/:id')
  .get((...args) => controller.findById(...args))
  .put(checkPermission, (...args) => controller.update(...args))
  .delete(checkPermission, (...args) => controller.remove(...args));

router.route('/company/:companyId')
  .get((...args) => controller.findByCompanyId(...args))

router.route('/:id/user/:userId')
  .put(checkPermission, (...args) => controller.addUser(...args))
  .delete(checkPermission, (...args) => controller.deleteUser(...args))


router.endpoint = "/project"

module.exports = router;
