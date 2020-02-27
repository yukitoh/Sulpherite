const db = require('../../db.js');

async function logs(spt, data){
	db.query(`SELECT * FROM keys`, function (err, result, fields){
		console.dir(result);
	})
	data.channel.send(`Logs I've recorded so far: ${result.length} keys`);
}

module.exports = logs;