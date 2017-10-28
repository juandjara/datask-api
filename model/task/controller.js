const Controller = require('../../lib/controller');
const taskFacade = require('./facade');

class TaskController extends Controller {
  findByProject(req, res, next) {
    const {sort, page = 0, size = 5, q} = req.query
    const query = {
      project: req.params.projectId,
      name: {
        $regex: new RegExp(q),
        $options: 'i'
      }
    }
    const populate = {
      path: 'asignee',
      select: 'name surname _id'
    }
    return this.facade.paginate(page, size, sort, query, populate)
    .then(pageDataMapped => res.json(pageDataMapped))
    .catch(next)
  }
  findByUser(req, res, next) {
    const {sort, page = 0, size = 5, q} = req.query
    const query = {
      asignee: req.params.userId,
      name: {
        $regex: new RegExp(q),
        $options: 'i'
      }
    }
    return this.facade.paginate(page, size, sort, query)
    .then(pageDataMapped => res.json(pageDataMapped))
    .catch(next)
  }
  create(req, res, next) {
    const body = {
      ...req.body,
      project: req.params.projectId
    }
    this.facade.create(body)
      .then(doc => res.status(201).json(doc))
      .catch(err => next(err));
  }

}

module.exports = new TaskController(taskFacade);
