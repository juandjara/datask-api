const Router = require('express').Router;
const router = new Router();

const user = require('./model/user/router');
const pet = require('./model/pet/router');
const pkg = require('./package.json')

const routes = [user, pet];
const startDate = new Date();

router.route('/').get((req, res) => {
  const info = {
    links: routes.map(route => route.endpoint),
    name: pkg.name,
    version: pkg.version,
    started_at: startDate,
    uptime: `${new Date() - startDate} ms`
  }
  return info
});

routes.forEach(route => router.use(route.endpoint, route));

module.exports = router;
