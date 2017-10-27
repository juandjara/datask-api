const Controller = require('../../lib/controller');
const projectFacade = require('./facade');
const boom = require('boom')

class ProjectController extends Controller {
  findByCompanyId(req, res, next) {
    const {sort, page = 0, size = 5} = req.query
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
      limit: parseInt(size)
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
      return
    }
    const userId = req.user._id
    const projectId = req.params.id
    this.facade.findById(projectId)
    .then(project => {
      if (project.manager && project.manager._id.toString() === userId) {
        next()
        return
      }
      next(boom.forbidden('You must be the manager of the project to perform this action'))
    })
    .catch(next)
  }
  userIsMember(req, res, next) {
    const {roles} = req.user
    const isAdmin = roles.indexOf("ADMIN") !== -1
    const isDeveloper = roles.indexOf("DEVELOPER") !== -1

    if (isAdmin) {
      next()
      return
    }
    if (!isDeveloper) {
      next(boom.forbidden("You must ADMIN or DEVELOPER to perform this action"))
      return
    }
    const userId = req.user._id
    const projectId = req.params.id

    this.facade.findById(projectId)
    .then(project => {
      const isManager = project.manager && project.manager._id.toString() === userId
      const isMember  = project.users.some(user => user.id === userId)

      if (!isMember && !isManager) {
        next(boom.forbidden('You must be member or manager of this project to perform this action'))
        return
      }
      next()
    })
    .catch(next)
  }
}

module.exports = new ProjectController(projectFacade);
