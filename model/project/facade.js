const Facade = require('../../lib/facade');
const projectSchema = require('./schema');

class ProjectFacade extends Facade {}

module.exports = new ProjectFacade(projectSchema);
