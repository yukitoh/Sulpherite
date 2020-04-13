const config = require("../../config.json");

function updateEndedCP(spt, afkObj){
	if (afkObj['nitro'].length == 0){
		var ntrMsg = 'None';
	} else {
		var ntrMsg = afkObj['nitro'].join(', ');
	}
	if (afkObj['backupkey'] != undefined){
		var backupKeysMsg = `\nBackups: ${afkObj['backupkey'].join(', ')}`;
	} else {
		backupKeysMsg = '';
	}
	const channelName = spt.channels.get(afkObj['channel']).name;
	const embed = {
		color: 1122214,
		footer: {
		text: "The afk check has been aborted by "+spt.guilds.get(config.fungal.id).members.get(afkObj['host']).displayName
		},
		author: {
		name: `AFK Check control panel for `+channelName
		},
		fields: [
		{
			name: "Our current keys are...",
			value: `${spt.emojis.find(emoji => emoji.name === "fungalkey")} ${afkObj['key']} ${backupKeysMsg}`
		},
		{
			name: "Location of the run:",
			value: `${afkObj['location']}`
		},
		{
			name: "Our current rushers are:",
			value: `${spt.emojis.find(emoji => emoji.name === "rusher")} ${afkObj['rusher']}`
		},
		{
			name: "Nitro Booster and Godly Key Popper / Donators With Location:",
			value: `${spt.emojis.find(emoji => emoji.name === "nitro")} ${ntrMsg}`
		}
		]
	};

	return embed;
}

module.exports = updateEndedCP;