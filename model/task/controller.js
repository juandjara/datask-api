const Controller = require('../../lib/controller');
const taskFacade = require('./facade');

class TaskController extends Controller {}

module.exports = new TaskController(taskFacade);
