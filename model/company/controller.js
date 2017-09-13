const Controller = require('../../lib/controller');
const companyFacade = require('./facade');

class CompanyController extends Controller {}

module.exports = new CompanyController(companyFacade);
