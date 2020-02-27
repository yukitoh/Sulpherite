const mysql = require('mysql');

const connection = mysqL.createConnection({
	host: 'sql206.epizy.com',
	user: 'epiz_25265559',
	password: process.env.DBPW,
	database:'epiz_25265559_sulpherite'
})

connection.connect(function(err) {
	if (err){
		console.log(err);
	} else {
		console.log('Connected to db.');
	}
})

module.exports = connection; 