const config = require('../../config.json');
const db = require('../../db.js');

async function pop(spt, data){
	var args = data.content.split(' ');
	var key;

	if (!args[1] || args[1] != 'fc'){
		return data.channel.send('Please specify a type of run (available: fc).');
	}
	if (!args[2]){
		if (data.mentions.members.first()){
		  key = data.mentions.members.first();
		} else {
			return data.channel.send(`Please mention or write key poppers name.`);
		}
	} else {
		spt.guilds.get(config.fungal.id).members.forEach(member => {
			if (member.displayName.toLowerCase() == args[2].toLowerCase()) key = member;
		})
		if (key == undefined) return data.channel.send(`Could not find any user with this name.`);
	}

	if (key && args[3] && !isNaN(args[3])){
		data.channel.send(`Are you sure ${key} popped ${args[3]} fungal keys? (yes or no)`)
			.then(() => {
				data.channel.awaitMessages(res => res.content === 'yes' || res.content == 'y' || res.content == 'n' || res.content == 'no', { max: 1, time: 30000, errors: ['time'] })
  					.then(async (resp) => {
  						if (resp.first().content == 'yes' || resp.first().content == 'y'){
      						// popped many keys
      						await db.query(`SELECT * FROM keys WHERE id = '${key.user.id}'`, async function (err, reskeys, fields){
      							if (reskeys.length > 0){
      								// update multiple
      								db.query(`UPDATE keyers SET amount = '`+(reskeys[0].amount+args[3])+`' WHERE id = '${key.user.id}'`);
                      data.channel.send(`Gave ${args[3]} key pops to ${key}, he is now at `+(reskeys[0].amount+args[3])+` keys popped.`);
      							} else {
      								// insert multiple
      								db.query(`INSERT INTO keyers (id, amount) VALUES ('${key.user.id}', '${args[3]}')`);
                      data.channel.send(`Gave ${args[3]} key pops to ${key}, he is now at ${args[3]} keys popped.`);
      							}
      						})
      					}
      				})
    				.catch(() => {
      					return data.channel.send('No confirmation message was sent, aborting.');
    				});
			})
	} else if (key){
		data.channel.send(`Are you sure ${key} popped 1 fungal key? (yes or no)`)
			.then(() => {
				data.channel.awaitMessages(res => res.content === 'yes' || res.content == 'y' || res.content == 'n' || res.content == 'no', { max: 1, time: 30000, errors: ['time'] })
  					.then(async (resp) => {
  						if (resp.first().content == 'yes' || resp.first().content == 'y'){
      						// popped one key
      						await db.query(`SELECT * FROM keys WHERE id = '${key.user.id}'`, async function (err, reskeys, fields){
      							if (reskeys.length > 0){
      								// update one
      								db.query(`UPDATE keyers SET amount = '`+(reskeys[0].amount+1)+`' WHERE id = '${key.user.id}'`);
                      data.channel.send(`Gave 1 key pops to ${key}, he is now at `+(reskeys[0].amount+1)+` keys popped.`);
      							} else {
      								// insert one
      								db.query(`INSERT INTO keyers (id, amount) VALUES ('${key.user.id}', '1')`);
                      data.channel.send(`Gave 1 key pops to ${key}, he is now at 1 keys popped.`);
      							}
      						})
      					} else {
      						data.channel.send(`Cancelled.`);
      					}
      				})
    				.catch(() => {
      					return data.channel.send('No confirmation message was sent, aborting.');
    				});
			})
	} else {
		return data.channel.send(`Could not find any key.`);
	}
}

module.exports = pop;