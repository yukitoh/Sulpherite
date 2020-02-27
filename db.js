const mysql = require('mysql');

const connection = mysql.createConnection({
	host: '85.10.205.173',
	user: 'sulpherite',
	password: process.env.DBPW,
	database:'sulpherite'
})

connection.connect(function(err) {
	if (err){
		console.log(err);
	} else {
		console.log('Connected to db.');
	}
})

module.exports = connection; 