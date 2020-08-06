const dotenv = require('dotenv');
dotenv.config();

const Pool = require('pg').Pool;

const pool  = new Pool({

	user: process.env.HEROKU_DB_USER,
	host: process.env.HEROKU_DB_HOST,
	database: process.env.HEROKU_DB_NAME,
	password: process.env.HEROKU_DB_PASSWORD,
	port: process.env.HEROKU_DB_PORT,
	
	ssl: {rejectUnauthorized: false}

});

module.exports = pool;