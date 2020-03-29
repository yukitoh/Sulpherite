const config = require("../../config.json");
const afks = require("../cmds.js").afks;
const fceUpd = require("../cmds.js").updAfkObj;

async function handleReacts(spt, reaction, user){
	// locate afk check
	var currAfk;
	for (x in afks) {
		if (afks[x]['controlpanel'] != undefined && reaction.message.id == afks[x]['controlpanel'] || afks[x]['afkcheck'] != undefined && reaction.message.id == afks[x]['afkcheck']) currAfk = afks[x];
	}

	if (currAfk != undefined){
		switch(reaction.message.id){
			case currAfk['afkcheck']:
				// afk check unreact
				switch (reaction.emoji.name){
					case 'fungal':
						if(afks[x]['raiders'].includes(user.id)){
							var index = afks[x]['raiders'].indexOf(user.id);
							if (index > -1) {
								afks[x]['raiders'].splice(index, 1);
							}
						}
						fceUpd(spt, false);
						break;
					case 'fungalkey':
						if (currAfk['key'] == user){
							user.send(`You have unreacted with ${spt.emojis.find(emoji => emoji.name === "fungalkey")}.\nPlease keep in mind that this is suspendable if it is fake react or abused.`)
							currAfk['key'] = 'None';
							spt.channels.get(config.fungal.rlChan).send(`${user} unreacted from being the main ${spt.emojis.find(emoji => emoji.name === "fungalkey")}.`);
           					fceUpd(spt, false);
						}
						break;
					case 'warrior':
						var index = currAfk['warriors'].indexOf(user.id);
						if (index > -1) {
							currAfk['warriors'].splice(index, 1);
						}
						break;
					case 'paladin':
						var index = currAfk['paladins'].indexOf(user.id);
						if (index > -1) {
							currAfk['paladins'].splice(index, 1);
						}
						break;
					case 'knight':
						var index = currAfk['knights'].indexOf(user.id);
						if (index > -1) {
							currAfk['knights'].splice(index, 1);
						}
						break;
					case 'priest':
						var index = currAfk['priests'].indexOf(user.id);
						if (index > -1) {
							currAfk['priests'].splice(index, 1);
						}
						break;
					case 'trickster':
						var index = currAfk['tricksters'].indexOf(user.id);
						if (index > -1) {
							currAfk['tricksters'].splice(index, 1);
						}
						break;
					case 'rusher':
						if (currAfk['rusher'] == user){
							user.send(`You were the rusher but unreacted with ${spt.emojis.find(emoji => emoji.name === "rusher")}.\nPlease keep in mind that this is suspendable if it is fake react or abused.`)
           					spt.channels.get(config.fungal.rlChan).send(`${user} unreacted from being the main ${spt.emojis.find(emoji => emoji.name === "rusher")}.`);
           					currAfk['rusher'] = 'None';
           					fceUpd(spt, false);
           				}
						break;
					case 'nitro':
						if(spt.guilds.get(config.fungal.id).members.get(user.id).roles.find(x => x.name === config.fungal.ntrRole)) {
							var index = currAfk['nitro'].indexOf(user);
							if (index > -1) {
								currAfk['nitro'].splice(index, 1);
							}
						}
						break;
					default:
						// wrong reaction, skip
						break;
				}
				break;
		}
	}
}

module.exports = handleReacts;