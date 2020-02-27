const db = require('../../db.js');

async function logs(spt, data){
	con.connect(function(err) {
		if (err) throw err;
		db.query(`SELECT * FROM keyers`, function (err, result, fields){
			if (err) throw err;
			console.dir(result);
		})
		data.channel.send(`Logs I've recorded so far: ${result.length} keys`);
	})
}

module.exports = logs;