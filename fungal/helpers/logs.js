const db = require('../../db.js');

async function logs(spt, data){
	await db.query('SELECT * FROM keys WHERE 1', async function (err, resultkeys, fields){
		console.dir(resultkeys);
		await db.query('SELECT * FROM rls WHERE 1', async function (err, resultrls, fields){
			console.dir(resultrls);

			var fails = 0;
			var successes = 0;
			var keys = 0;

			if (resultrls){
				resultrls.forEach(rl => {
					console.dir(rl);
				})
			}

			if (resultrls){
				resultrls.forEach(rl => {
					console.dir(rl);
				})
			}

			if (resultkeys){
				resultkeys.forEach(key => {
					console.dir(key);
				})
			}

			await data.channel.send(`**Logs I've recorded so far:**\n${keys} keys, ${successes} successes and ${fails} fails.`);
		})
	})
}

module.exports = logs;