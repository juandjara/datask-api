require('dotenv').config()

const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 8080
  },
  mongo: {
    url: process.env.MONGO_DB_URI || 'mongodb://localhost/generated-express-api'
  },
  secret: 'mega_token_secret'
};

module.exports = config;
