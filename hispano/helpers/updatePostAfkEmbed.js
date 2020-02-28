const config = require("../../config.json");

function updateEmbed(spt, afkObj){
	const fungalReact = spt.emojis.find(emoji => emoji.name === "fungal");
	const hostUser = spt.guilds.get(config.hispano.id).members.get(afkObj['host']);
	const channelName = spt.channels.get(afkObj['channel']).name;
	const embed = {
		description: `**__Post afk move-in!__**\nIf you got disconnected due to the android bug or just missed the afk check in general, join lnge **then** react with ${fungalReact} to get moved in.\n__Time remaining:__ ${afkObj['timeleft']} seconds.`,
		color: 1122214,
		timestamp: afkObj['started'],
		footer: {
		text: "The afk check has been ended by "+hostUser.displayName
		},
		author: {
		name: "Fungal Cavern started by "+hostUser.displayName+" in "+channelName,
		icon_url: spt.users.get(afkObj['host']).avatarURL
		}
	};

	return embed;
}

module.exports = updateEmbed;