const db = require('../../db.js');

async function logs(spt, data){
	await db.query(`SELECT * FROM keys`, function (err, resultkeys, fields){
		console.dir(result);
		await db.query(`SELECT * FROM keys`, function (err, resultrls, fields){
			console.dir(resultrls);
			await data.channel.send(`**Logs I've recorded so far:**\n*${resultkeys.length}* keys, *${resultrls.length}* successes and *${resultrls.length}* fails.`);
		})
	})
}

module.exports = logs;