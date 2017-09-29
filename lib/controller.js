const boom = require('boom')

class Controller {
  constructor(facade) {
    this.facade = facade;
  }

  create(req, res, next) {
    this.facade.create(req.body)
      .then(doc => res.status(201).json(doc))
      .catch(err => next(err));
  }

  paginate(req, res, next) {
    const {sort, page = 0, limit = 5, q} = req.query
    if (parseInt(page) < 0) {
      return next(boom.badRequest('Page number must be 0 or greater'))
    }
    const query = {}
    if(q) {
      query.$text = {
        $search: q,
        $caseSensitive: false,
        $diacriticSensitive: false
      }
    }
    return this.facade.paginate(query, {
      sort,
      page: parseInt(page) + 1,
      limit: parseInt(limit)
    }).then(pageData => res.json({
      docs: pageData.docs,
      page: pageData.page - 1,
      size: pageData.limit,
      first: pageData.page === 1,
      last: pageData.page >= pageData.pages,
      totalPages: pageData.pages,
      totalElements: pageData.total
    })).catch(next)
  }

  find(req, res, next) {
    return this.facade.find(req.query)
      .then(collection => res.status(200).json(collection))
      .catch(err => next(err));
  }

  findOne(req, res, next) {
    return this.facade.findOne(req.query)
      .then(doc => res.status(200).json(doc))
      .catch(err => next(err));
  }

  findById(req, res, next) {
    return this.facade.findById(req.params.id)
      .then((doc) => {
        if (!doc) { return next(boom.notFound()) }
        return res.status(200).json(doc);
      })
      .catch(err => next(err));
  }

  update(req, res, next) {
    this.facade.findByIdAndUpdate(req.params.id, req.body)
      .then(doc => res.json(doc))
      .catch(err => next(err))
  }

  remove(req, res, next) {
    this.facade.remove({ _id: req.params.id })
      .then((doc) => {
        if (!doc) { return next(boom.notFound()) }
        return res.status(200).json(doc.result);
      })
      .catch(err => next(err));
  }
}

module.exports = Controller;
