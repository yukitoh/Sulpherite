const db = require('../../db.js');

async function logs(spt, data){
	await db.query(`SELECT * FROM keys`, async function (err, resultkeys, fields){
		console.dir(result);
		await db.query(`SELECT * FROM keys`, async function (err, resultrls, fields){
			console.dir(resultrls);
			let fails = 0;
			let successes = 0;
			let fails = resultrls.forEach(rl => {
				if (rl.fail > 0) fails += rl.fail;
			})
			let successes = resultrls.forEach(rl => {
				if (rl.success > 0) successes += rl.success;
			})
			await data.channel.send(`**Logs I've recorded so far:**\n*${resultkeys.length}* keys, *${successes}* successes and *${fails}* fails.`);
		})
	})
}

module.exports = logs;