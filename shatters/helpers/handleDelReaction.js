const config = require("../../config.json");
const afkChecks = require("../commands.js").afkChecks;
const forceUpdate = require("../commands.js").updateAfkObjs;

async function handleReacts(spt, reaction, user){
	// locate afk check
	var currAfkCheckObj;
	for (x in afkChecks) {
		if (reaction.message.id == afkChecks[x]['controlpanel'] || reaction.message.id == afkChecks[x]['afkcheck']) currAfkCheckObj = afkChecks[x];
	}

	if (currAfkCheckObj != undefined){
		switch(reaction.message.id){
			case currAfkCheckObj['afkcheck']:
				// afk check unreact
				switch (reaction.emoji.name){
					case 'shatters':
						if(afkChecks[x]['raiders'].includes(user.id)){
							var index = afkChecks[x]['raiders'].indexOf(user.id);
							if (index > -1) {
								afkChecks[x]['raiders'].splice(index, 1);
							}
						}
						forceUpdate(spt, false);
						break;
					case 'shatterskey':
						if (currAfkCheckObj['key'] == user){
							user.send(`You have unreacted with ${spt.emojis.find(emoji => emoji.name === "shatterskey")}.\nPlease keep in mind that this is suspendable if it is fake react or abused.`)
							currAfkCheckObj['key'] = 'None';
							spt.channels.get(config.shatters.rlBotChannelID).send(`${user} unreacted from being the main ${spt.emojis.find(emoji => emoji.name === "shatterskey")}.`);
           					forceUpdate(spt, false);
						}
						break;
					case 'warrior':
						var index = currAfkCheckObj['warriors'].indexOf(user);
						if (index > -1) {
							currAfkCheckObj['warriors'].splice(index, 1);
						}
						break;
					case 'paladin':
						var index = currAfkCheckObj['paladins'].indexOf(user);
						if (index > -1) {
							currAfkCheckObj['paladins'].splice(index, 1);
						}
						break;
					case 'knight':
						var index = currAfkCheckObj['knights'].indexOf(user);
						if (index > -1) {
							currAfkCheckObj['knights'].splice(index, 1);
						}
						break;
					case 'trickster':
						var index = currAfkCheckObj['tricksters'].indexOf(user);
						if (index > -1) {
							currAfkCheckObj['tricksters'].splice(index, 1);
						}
						break;
					case 'priest':
						if (currAfkCheckObj['supremepriest'].includes(user)){
           					spt.channels.get(config.shatters.rlBotChannelID).send(`${user} unreacted from supreme ${spt.emojis.find(emoji => emoji.name === "priest")}.`);
           					var index = currAfkCheckObj['supremepriest'].indexOf(user);
							if (index > -1) {
								currAfkCheckObj['supremepriest'].splice(index, 1);
							}
           					forceUpdate(spt, false);
           				}
           				var index = currAfkCheckObj['priests'].indexOf(user);
							if (index > -1) {
								currAfkCheckObj['priests'].splice(index, 1);
						}
						break;
					case 'nitro':
						if(spt.guilds.get(config.shatters.id).members.get(user.id).roles.find(x => x.name === config.shatters.nitroRole)) {
							var index = currAfkCheckObj['nitro'].indexOf(user);
							if (index > -1) {
								currAfkCheckObj['nitro'].splice(index, 1);
							}
						}
						break;
					case 'first': case 'second': case 'secret':
						if (currAfkCheckObj['rushers'].includes(user)){
							var index = currAfkCheckObj['rushers'].indexOf(user);
							if (index > -1) {
								currAfkCheckObj['rushers'].splice(index, 1);
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