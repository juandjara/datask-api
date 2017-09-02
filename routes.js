const Router = require('express').Router;
const router = new Router();

const user = require('./model/user/router');
const pet = require('./model/pet/router');
const pkg = require('./package.json')

const routes = [user, pet];
const startDate = new Date();

router.route('/').get((req, res) => {
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
