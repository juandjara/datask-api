const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();
const projectController = require('../project/controller')

const checkPermission = projectController.userIsManager.bind(projectController)

router.use(checkPermission)

router.post('/', (...args) => controller.create(...args));

router.get('/by_project/:projectId', (...args) => controller.findByProject(...args))
router.get('/by_user/:userId', (...args) => controller.findByUser(...args))

router.route('/:id')
  .put((...args) => controller.update(...args))
  .get((...args) => controller.findById(...args))
  .delete((...args) => controller.remove(...args));

router.endpoint = '/task'

module.exports = router;
