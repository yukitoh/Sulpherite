const config = require("../../config.json");

function updateEmbed(spt, afkCheckObj){
	const shattersReact = spt.emojis.find(emoji => emoji.name === "shatters");
	const hostUser = spt.guilds.get(config.shatters.id).members.get(afkCheckObj['host']);
	const channelName = spt.channels.get(afkCheckObj['channel']).name;
	const embed = {
		description: `**__Post afk move-in!__**\nIf you got disconnected due to the android bug or just missed the afk check in general, join lounge **then** react with ${shattersReact} to get moved in.\n__Time remaining:__ ${afkCheckObj['timeleft']} seconds.`,
		color: 31247,
		timestamp: afkCheckObj['started'],
		footer: {
		text: "The afk check has been ended by "+hostUser.displayName
		},
		author: {
		name: "Shatters started by "+hostUser.displayName+" in "+channelName,
		icon_url: spt.users.get(afkCheckObj['host']).avatarURL
		}
	};

	return embed;
}

module.exports = updateEmbed;