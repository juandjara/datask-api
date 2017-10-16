const express    = require('express');
const helmet     = require('helmet');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const jwt        = require('express-jwt');
const cors = require('cors')

const config = require('./config');
const routes = require('./routes');

const app  = express();

app.set('json spaces', 2);

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(bodyParser.json({limit: '10mb'}));
app.use(morgan('tiny'));
app.use('/swagger-ui', express.static('swagger-ui'))

const jwtWhitelist = ['/', '/user/authenticate'];

app.use(jwt({secret: config.secret}).unless({path: jwtWhitelist}));
app.use('/', routes);

app.use((err, req, res, next) => {
  if (config.environment === 'dev') {
    console.error(err)
  } else {
    console.error(err.message)
  }
  let status = err.status || 500
  if (err.isBoom) {
    status = err.output.statusCode
  }
  if (err.name === "ValidationError") {
    status = 400
  }
  res.status(status)
     .json({name: err.name, status, error: err.message});
});

module.exports = app;
