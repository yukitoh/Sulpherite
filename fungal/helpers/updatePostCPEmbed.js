const config = require("../../config.json");

function updateEndedCP(spt, afkCheckObj){
	const channelName = spt.channels.get(afkCheckObj['channel']).name;
	const embed = {
		color: 1122214,
		footer: {
		text: "The afk check has been ended by "+spt.guilds.get(config.fungal.id).members.get(afkCheckObj['host']).displayName
		},
		author: {
		name: `AFK Check control panel for `+channelName
		},
		fields: [
		{
			name: "Our current keys are...",
			value: `${spt.emojis.find(emoji => emoji.name === "fungalkey")} ${afkCheckObj['key']}`
		},
		{
			name: "Location of the run:",
			value: `${afkCheckObj['location']}`
		},
		{
			name: "Our current rushers are:",
			value: `${spt.emojis.find(emoji => emoji.name === "rusher")} ${afkCheckObj['rusher']}`
		},
		{
			name: "Nitro boosters with location:",
			value: `${spt.emojis.find(emoji => emoji.name === "nitro")} ${afkCheckObj['nitro']}`
		}
		]
	};

	return embed;
}

module.exports = updateEndedCP;