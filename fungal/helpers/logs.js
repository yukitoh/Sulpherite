const db = require('../../db.js');

async function logs(spt, data){
	if (err) throw err;
	db.query(`SELECT * FROM keyers`, function (result, fields){
		console.dir(result);
	})
	data.channel.send(`Logs I've recorded so far: ${result.length} keys`);
}

module.exports = logs;