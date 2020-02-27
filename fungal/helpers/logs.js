const db = require('../../db.js');

async function logs(spt, data){
	if (err) throw err;
	db.query(`SELECT * FROM keys`, function (err, result, fields){
		if (err) throw err;
		console.dir(result);
	})
}

module.exports = logs;