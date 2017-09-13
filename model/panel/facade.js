const Facade = require('../../lib/facade');
const panelSchema = require('./schema');

class PanelFacade extends Facade {}

module.exports = new PanelFacade(panelSchema);
