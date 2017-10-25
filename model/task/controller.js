const Controller = require('../../lib/controller');
const taskFacade = require('./facade');
const boom = require('boom')

class TaskController extends Controller {
  paginate(req, res, next) {
    const {sort, page = 0, size = 5, q} = req.query
    if (parseInt(page) < 0) {
      return next(boom.badRequest('Page number must be 0 or greater'))
    }
    const query = {
      project: req.params.projectId
    }
    if (q) {
      query.name = {
        $regex: new RegExp(q),
        $options: 'i'
      }
    }
    return this.facade.paginate(query, {
      sort,
      page: parseInt(page) + 1,
      limit: parseInt(size),
      populate: {
        path: 'asignee',
        select: 'name surname _id'
      }
    })
    .then(pageData => this.facade.mapPageData(pageData))
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
