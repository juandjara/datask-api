const Router = require('express').Router;
const router = new Router();

const user = require('./model/user/router');
const pet = require('./model/pet/router');

const routes = [user, pet];
const startDate = new Date();

router.route('/').get((req, res) => {
  res.json({
    links: routes.map(route => route.endpoint),
    name: 'generated-express-api',
    started_at: startDate,
    uptime: `${new Date() - startDate} ms`
  });
});

routes.forEach(route => router.use(route.endpoint, route));

module.exports = router;
