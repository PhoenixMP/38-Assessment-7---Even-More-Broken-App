/** Shared config for application; can be req'd many places. */

require('dotenv');

const SECRET_KEY = process.env.SECRET_KEY || 'development-secret-key';

const PORT = +process.env.PORT || 3000;

const BCRYPT_WORK_FACTOR = 10;

let DB_URI = {
  user: 'phoenixp',
  host: 'localhost',
  database: '',
  port: 5432,
  password: 'myPassword'
}

if (process.env.NODE_ENV === "test") {
  DB_URI.database = "bankly_test";
} else {
  DB_URI.database = "bankly";
}



module.exports = {
  BCRYPT_WORK_FACTOR,
  SECRET_KEY,
  PORT,
  DB_URI
};
