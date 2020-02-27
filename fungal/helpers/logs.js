const db = require('../../db.js');

async function logs(spt, data){
	await db.query(`SELECT * FROM keys`, async function (err, resultkeys, fields){
		console.dir(resultkeys);
		await db.query(`SELECT * FROM rls`, async function (err, resultrls, fields){
			console.dir(resultrls);

			var fails = 0;
			var successes = 0;

			if (resultkeys != undefined){
				fails = resultrls.forEach(rl => {
					if (rl.fail > 0) fails += rl.fail;
				})
			}

			if (resultrls != undefined){
				successes = resultrls.forEach(rl => {
					if (rl.success > 0) successes += rl.success;
				})
			}

			await data.channel.send(`**Logs I've recorded so far:**\n*${resultkeys.length}* keys, *${successes}* successes and *${fails}* fails.`);
		})
	})
}

module.exports = logs;