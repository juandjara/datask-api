const Controller = require('../../lib/controller');
const panelFacade = require('./facade');

class PanelController extends Controller {}

module.exports = new PanelController(panelFacade);
