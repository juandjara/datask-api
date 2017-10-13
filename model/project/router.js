const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();
const jwtRoles = require('express-jwt-permissions')({
  permissionsProperty: 'roles'
})

const checkAdmin = jwtRoles.check('ADMIN')
const checkPermission = (...args) => (
  checkAdmin(...args) || controller.userIsManager(...args)
)

router.route('/')
  .get((...args) => controller.paginate(...args))
  .post((...args) => controller.create(...args));

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
