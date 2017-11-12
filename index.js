const app      = require('./server')
const config   = require('./config')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(config.mongo.url, {useMongoClient: true})

app.listen(config.server.port, () => {
  console.log(`Magic happens on port ${config.server.port}`);
});
