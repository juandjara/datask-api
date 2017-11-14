const Facade = require('../../lib/facade');
const timeSchema = require('./schema');

class TimeFacade extends Facade {}

module.exports = new TimeFacade(timeSchema);
