const db = require('../../db.js');

async function logs(spt, data){
	await db.query('SELECT * FROM keyers', async function (err, resultkeys, fields){
		console.dir(resultkeys);
		await db.query('SELECT * FROM rls', async function (err, resultrls, fields){
			console.dir(resultrls);

			var fails = 0;
			var successes = 0;
			var keys = 0;

			if (resultrls){
				resultrls.forEach(rl => {
					fails += rl.fail;
					successes += rl.success;
				})
			}

			if (resultkeys){
				resultkeys.forEach(key => {
					keys += key.amount;
				})
			}

			await data.channel.send(`**Logs I've recorded so far:**\n${keys} keys, ${successes} successes and ${fails} fails.`);
		})
	})
}

module.exports = logs;