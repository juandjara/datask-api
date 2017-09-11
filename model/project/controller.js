const Controller = require('../../lib/controller');
const projectFacade = require('./facade');

class ProjectController extends Controller {
  paginate(req, res, next) {
    const {sort, page = 1, limit = 5} = req.query
    return this.facade.paginate({}, {
      sort,
      page: parseInt(page),
      limit: parseInt(limit)
    }).then(page => res.json(page))
      .catch(next)
  }
}

module.exports = new ProjectController(projectFacade);
