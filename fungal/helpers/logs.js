const db = require('../../db.js');

async function logs(spt, data){
	await db.query('SELECT * FROM keys WHERE 1', async function (err, resultkeys, fields){
		console.dir(resultkeys);
		await db.query('SELECT * FROM rls WHERE 1', async function (err, resultrls, fields){
			console.dir(resultrls);

			var fails = 0;
			var successes = 0;
			var keys = 0;

			if (resultrls != undefined && resultrls.length > 0){
				fails = resultrls.forEach(rl => {
					if (rl.fail > 0) fails += rl.fail;
				})
			}

			if (resultrls != undefined && resultrls.length > 0){
				successes = resultrls.forEach(rl => {
					if (rl.success > 0) successes += rl.success;
				})
			}

			if (resultkeys != undefined && resultkeys.length > 0){
				keys = resultkeys.forEach(key => {
					if (key.amount > 0) keys += key.amount;
				})
			}

			await data.channel.send(`**Logs I've recorded so far:**\n${keys} keys, ${successes} successes and ${fails} fails.`);
		})
	})
}

module.exports = logs;