const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();
const projectController = require('../project/controller')

const checkOwner = controller.userIsOwner.bind(controller)
const checkProjectMember = projectController.userIsMember()

router.route('/')
  // .get((...args) => controller.find(...args))
  .post(checkProjectMember, (...args) => controller.create(...args));

router.get('/by_project',
  (...args) => controller.aggregateByProject(...args))    

router.route('/:id')
  .put(checkOwner,
      (...args) => controller.update(...args))
  .delete(checkOwner,
         (...args) => controller.remove(...args));

router.get('/by_task/:taskId',
           (...args) => controller.findByTask(...args))

router.get('/by_user/:userId',
           (...args) => controller.agregateRecentTimeOfTaskForUser(...args))


router.post('/:id/finish', checkOwner,
            (...args) => controller.finish(...args))

router.get('/:id', (...args) => controller.findById(...args))


router.endpoint = '/time'

module.exports = router;
