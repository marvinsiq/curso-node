var mysql = require('mysql');

const mysqlConfig = require('../credentials/mysql');

function createDBConnection() {
	return mysql.createConnection({
		host: mysqlConfig.host,
		user: mysqlConfig.user,
		password: mysqlConfig.password,
		database: mysqlConfig.database
	});
}

module.exports = function () {
	return createDBConnection;
}
