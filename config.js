const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  PORT: process.env.PORT,
  DB_PASSWORD: process.env.DB_PASSWORD,
  HOST: 'localhost',
  USER: 'root',
  DATABASE: process.env.DATABASE
};
