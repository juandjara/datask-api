const Router = require('express').Router;
const router = new Router();
const pkg = require('./package.json')

const user = require('./model/user/router');
const project = require('./model/project/router')

const routes = [user, project];
const startDate = new Date();

router.get('/', (req, res) => {
  const links = ['/swagger-ui'].concat(routes.map(route => route.endpoint))
  const info = {
    links,
    name: pkg.name,
    version: pkg.version,
    started_at: startDate,
    uptime: `${new Date() - startDate} ms`
  }
  res.json(info)
});

routes.forEach(route => router.use(route.endpoint, route));

module.exports = router;
