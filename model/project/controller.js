const Controller = require('../../lib/controller');
const projectFacade = require('./facade');

class ProjectController extends Controller {}

module.exports = new ProjectController(projectFacade);
