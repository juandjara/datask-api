const Facade = require('../../lib/facade');
const companySchema = require('./schema');

class CompanyFacade extends Facade {}

module.exports = new CompanyFacade(companySchema);
