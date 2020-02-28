const db = require('../../db.js');

async function printlog(spt, data){
	await db.query(`SELECT * FROM keyers`, async function (err, reskeys, fields){
		await db.query(`SELECT * FROM rls`, async function (err, resrls, fields){
			
		})
	})
}

module.exports = printlog;