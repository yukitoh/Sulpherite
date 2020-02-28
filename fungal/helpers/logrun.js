const config = require('../../config.json');
const db = require('../../db.js');

async function logrun(spt, data){
	var args = data.split(' ');

	if (!args[1]){
		return data.channel.send('Please specify a type of run (available: fc).');
	}
	if (!args[2] || args[2] != 'f' && args[2] != 's' || args[2] != 'fail' && args[2] != 's'){
		return data.channel.send(`Please specify if run was a success or a fail.`);
	}
	if (args[3])
}

module.exports = logrun;