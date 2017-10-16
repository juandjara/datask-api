const app      = require('./server')
const config   = require('./config')
const mongoose = require('mongoose')
const bluebird = require('bluebird')

mongoose.Promise = bluebird
mongoose.connect(config.mongo.url, {useMongoClient: true})

app.listen(config.server.port, () => {
  console.log(`Magic happens on port ${config.server.port}`);
});
