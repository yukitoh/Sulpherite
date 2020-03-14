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
					case 'shatters':
						if(afks[x]['raiders'].includes(user.id)){
							var index = afks[x]['raiders'].indexOf(user.id);
							if (index > -1) {
								afks[x]['raiders'].splice(index, 1);
							}
						}
						fceUpd(spt, false);
						break;
					case 'shatterskey':
						if (currAfk['key'] == user){
							user.send(`You have unreacted with ${spt.emojis.find(emoji => emoji.name === "shatterskey")}.\nPlease keep in mind that this is suspendable if it is fake react or abused.`)
							currAfk['key'] = 'None';
							spt.channels.get(config.shatters.rlChan).send(`${user} unreacted from being the main ${spt.emojis.find(emoji => emoji.name === "shatterskey")}.`);
           					fceUpd(spt, false);
						}
						break;
					case 'warrior':
						var index = currAfk['warriors'].indexOf(user);
						if (index > -1) {
							currAfk['warriors'].splice(index, 1);
						}
						break;
					case 'paladin':
						var index = currAfk['paladins'].indexOf(user);
						if (index > -1) {
							currAfk['paladins'].splice(index, 1);
						}
						break;
					case 'knight':
						var index = currAfk['knights'].indexOf(user);
						if (index > -1) {
							currAfk['knights'].splice(index, 1);
						}
						break;
					case 'trickster':
						var index = currAfk['tricksters'].indexOf(user);
						if (index > -1) {
							currAfk['tricksters'].splice(index, 1);
						}
						break;
					case 'mystic':
						var index = currAfk['mystics'].indexOf(user);
						if (index > -1) {
							currAfk['mystics'].splice(index, 1);
						}
						spt.channels.get(config.shatters.rlChan).send(`${user} unreacted from ${spt.emojis.find(emoji => emoji.name === "mystic")}.`);
						break;
					case 'priest':
						if (currAfk['supremepriest'].includes(user)){
           					spt.channels.get(config.shatters.rlChan).send(`${user} unreacted from supreme ${spt.emojis.find(emoji => emoji.name === "priest")}.`);
           					var index = currAfk['supremepriest'].indexOf(user);
							if (index > -1) {
								currAfk['supremepriest'].splice(index, 1);
							}
           					fceUpd(spt, false);
           				}
           				var index = currAfk['priests'].indexOf(user);
							if (index > -1) {
								currAfk['priests'].splice(index, 1);
						}
						break;
					case 'nitro':
						if(spt.guilds.get(config.shatters.id).members.get(user.id).roles.find(x => x.name === config.shatters.ntrRole)) {
							var index = currAfk['nitro'].indexOf(user);
							if (index > -1) {
								currAfk['nitro'].splice(index, 1);
							}
						}
						break;
					case 'first':
						if (currAfk['rushers']['first'].includes(user.id)){
							var index = currAfk['rushers']['first'].indexOf(user.id);
							if (index > -1) {
								await currAfk['rushers']['first'].splice(index, 1);
							}
						}
						break;
					case 'second':
						if (currAfk['rushers']['second'].includes(user.id)){
							var index = currAfk['rushers']['second'].indexOf(user.id);
							if (index > -1) {
								await currAfk['rushers']['second'].splice(index, 1);
							}
						}
						break;
					case 'secret':
						if (currAfk['rushers']['secret'].includes(user.id)){
							var index = currAfk['rushers']['secret'].indexOf(user.id);
							if (index > -1) {
								await currAfk['rushers']['secret'].splice(index, 1);
							}
						}
						break;
					default:
						// wrong reaction, skip
						break;
				}
				break;
			default:
				// control panel or other, ignore
				break;
		}
	}
}

module.exports = handleReacts;