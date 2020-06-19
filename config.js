const isProduction = process.env.NODE_ENV === 'production';

module.exports = isProduction
  ? {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    database: process.env.MONGO_DB,
    tokenSecret: process.env.TOKEN,
    saltRounds: process.env.SALT_ROUNDS,
  }
  : require('./config.json');
