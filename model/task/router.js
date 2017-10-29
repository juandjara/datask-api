const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();
const projectController = require('../project/controller')

const checkPermission = projectController.userIsMember()

router.post('/',
  checkPermission,
  (...args) => controller.create(...args));

router.get('/by_project/:projectId',
  checkPermission,
  (...args) => controller.findByProject(...args))

router.get('/by_user/:userId',
  checkPermission,
  (...args) => controller.findByUser(...args))

router.route('/:id')
  .get(
    checkPermission,
    (...args) => controller.findById(...args)
  )
  .put(
    checkPermission,
    (...args) => controller.update(...args)
  )
  .delete(
    checkPermission,
    (...args) => controller.remove(...args)
  );

router.endpoint = '/task'

module.exports = router;
