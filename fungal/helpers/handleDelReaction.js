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
					case 'fungal':
						currAfkCheckObj['raiders'] -= 1;
						forceUpdate(spt, false);
						break;
					case 'fungalkey':
						if (currAfkCheckObj['key'] == user){
							user.send(`You have unreacted with ${spt.emojis.find(emoji => emoji.name === "fungalkey")}.\nPlease keep in mind that this is suspendable if it is fake react or abused.`)
							currAfkCheckObj['key'] = 'None';
							spt.channels.get(config.fungal.rlBotChannelID).send(`${user} unreacted from being the main ${spt.emojis.find(emoji => emoji.name === "fungalkey")}.`);
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
					case 'priest':
						var index = currAfkCheckObj['priests'].indexOf(user);
						if (index > -1) {
							currAfkCheckObj['priests'].splice(index, 1);
						}
						break;
					case 'trickster':
						var index = currAfkCheckObj['tricksters'].indexOf(user);
						if (index > -1) {
							currAfkCheckObj['tricksters'].splice(index, 1);
						}
						break;
					case 'rusher':
						if (currAfkCheckObj['rusher'] == user){
							user.send(`You were the rusher but unreacted with ${spt.emojis.find(emoji => emoji.name === "rusher")}.\nPlease keep in mind that this is suspendable if it is fake react or abused.`)
           					spt.channels.get(config.fungal.rlBotChannelID).send(`${user} unreacted from being the main ${spt.emojis.find(emoji => emoji.name === "rusher")}.`);
           					currAfkCheckObj['rusher'] = 'None';
           					forceUpdate(spt, false);
           				}
						break;
					case 'nitro':
						if(spt.guilds.get(config.fungal.id).members.get(user.id).roles.find(x => x.name === config.fungal.nitroRole)) {
							var index = currAfkCheckObj['nitro'].indexOf(user);
							if (index > -1) {
								currAfkCheckObj['nitro'].splice(index, 1);
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