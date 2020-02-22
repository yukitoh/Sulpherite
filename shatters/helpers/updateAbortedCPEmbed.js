const config = require("../../config.json");

function updateEndedCP(spt, afkCheckObj){
	if (afkCheckObj['supremepriest'] == []){
		var supremePriestMessage = 'None';
	} else {
		var supremePriestMessage = afkCheckObj['supremepriest'].join(', ');
	}
	if (afkCheckObj['nitro'] == []){
		var nitroMessage = 'None';
	} else {
		var nitroMessage = afkCheckObj['nitro'].join(', ');
	}
	const channelName = spt.channels.get(afkCheckObj['channel']).name;
	const embed = {
		color: 31247,
		footer: {
		text: "The afk check has been aborted by "+spt.guilds.get(config.shatters.id).members.get(afkCheckObj['host']).displayName
		},
		author: {
		name: `AFK Check control panel for `+channelName
		},
		fields: [
		{
			name: "Our current keys are...",
			value: `${spt.emojis.find(emoji => emoji.name === "shatterskey")} ${afkCheckObj['key']}`
		},
		{
			name: "Location of the run:",
			value: `${afkCheckObj['location']}`
		},
		{
			name: "Our supreme priests are:",
			value: `${spt.emojis.find(emoji => emoji.name === "priest")} ${supremePriestMessage}`
		},
		{
			name: "Nitro boosters with location:",
			value: `${spt.emojis.find(emoji => emoji.name === "nitro")} ${nitroMessage}`
		}
		]
	};

	return embed;
}

module.exports = updateEndedCP;