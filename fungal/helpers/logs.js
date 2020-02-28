const db = require('../../db.js');

async function logs(spt, data){
	await db.query(`SELECT * FROM keyers`, async function (err, reskeys, fields){
		await db.query(`SELECT * FROM rls`, async function (err, resrls, fields){
			var fails = 0,
				successes = 0,
				keys = 0;
			if (resrls){
				resrls.forEach(rl => {
					fails += rl.fail;
					successes += rl.success;
				})
			}
			if (reskeys){
				reskeys.forEach(key => {
					keys += key.amount;
				})
			}
			await data.channel.send(`**Logs I've recorded so far:**\n${keys} keys, ${successes} successes and ${fails} fails.`);
		})
	})
}

module.exports = logs;