const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();
const jwtRoles = require('express-jwt-permissions')({
  permissionsProperty: 'roles'
})
const projectController = require('../project/controller')


const checkAdmin = jwtRoles.check('ADMIN')
const checkOwner = controller.userIsOwner.bind(controller)
const checkProjectMember = projectController.userIsMember()

router.route('/')
  // .get((...args) => controller.find(...args))
  .post(checkProjectMember, (...args) => controller.create(...args));

router.route('/:id')
  .put(checkOwner,
      (...args) => controller.update(...args))
  .delete(checkOwner,
         (...args) => controller.remove(...args));

router.get('/by_task/:taskId',
           (...args) => controller.findByTask(...args))

router.get('/by_user/:userId', checkAdmin,
           (...args) => controller.findByUser(...args))

router.post('/:id/finish', checkOwner,
            (...args) => controller.finish(...args))

router.endpoint = '/time'

module.exports = router;
