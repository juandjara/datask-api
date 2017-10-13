const Controller = require('../../lib/controller');
const projectFacade = require('./facade');
const boom = require('boom')

class ProjectController extends Controller {
  findByCompanyId(req, res, next) {
    const {sort, page = 0, limit = 5} = req.query
    const {companyId} = req.params
    if (parseInt(page) < 0) {
      return next(boom.badRequest('Page number must be 0 or greater'))
    }
    const query = {
      company: companyId
    }
    return this.facade.paginate(query, {
      sort,
      page: parseInt(page) + 1,
      limit: parseInt(limit)
    })
    .then(pageData => this.facade.mapPageData(pageData))
    .then(pageDataMapped => res.json(pageDataMapped))
    .catch(next)
  }
  addUser(req, res, next) {
    const {id, userId} = req.params
    this.facade.findById(id)
    .then(project => {
      project.users.push(userId)
      return project.save()
    })
    .then(savedProject => res.json(savedProject))
    .catch(next)
  }
  deleteUser(req, res, next) {
    const {id, userId} = req.params
    this.facade.findById(id)
    .then(project => {
      project.users.pull(userId)
      return project.save()
    })
    .then(savedProject => res.json(savedProject))
    .catch(next)
  }
  userIsManager(req, res, next) {
    if (req.user.roles.indexOf("ADMIN") !== -1) {
      next()
    }
    const userId = req.user._id
    const projectId = req.params.id
    this.facade.findById(projectId)
    .then(project => {
      if (project.manager._id.toString() === userId) {
        next()
        return
      }
      next(boom.forbidden('You must be the manager of the project to perform this action'))
    })
    .catch(next)
  }
}

module.exports = new ProjectController(projectFacade);
