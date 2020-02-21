const config = require("../../config.json");

function updateControlPanel(spt, afkCheckObj){
	const channelName = spt.channels.get(afkCheckObj['channel']).name;
	const embed = {
		color: 31247,
		footer: {
		text: "To abort the afk check, react with ❌ below."
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
			value: `${spt.emojis.find(emoji => emoji.name === "priest")} ${afkCheckObj['supremepriest']}`
		},
		{
			name: "Nitro boosters with location:",
			value: `${spt.emojis.find(emoji => emoji.name === "nitro")} ${afkCheckObj['nitro']}`
		}
		]
	};

	return embed;
}

module.exports = updateControlPanel;