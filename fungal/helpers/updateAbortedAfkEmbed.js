const config = require("../../config.json");

function updateEndedAFK(spt, afkObj){
	const channelName = spt.channels.get(afkObj['channel']).name;
	var rlAmount = 0;
	spt.channels.get(afkObj['channel']).members.forEach(async function(raiders){
		if (raiders.roles.find(r => r.name === config.fungal.arlRole) || raiders.roles.find(r => r.name === config.fungal.rlRole) || raiders.roles.find(r => r.name === config.fungal.vrlRole) || raiders.roles.find(r => r.name === config.fungal.hrlRole)) {
			rlAmount++;
		}
	})
	const embed = {
		color: 1122214,
		timestamp: afkObj['started'],
		footer: {
		text: "The afk check has been aborted by "+spt.guilds.get(config.fungal.id).members.get(afkObj['host']).displayName
		},
		description: `The afk check is now aborted.`,
		author: {
		name: "Fungal Cavern started by "+spt.guilds.get(config.fungal.id).members.get(afkObj['host']).displayName+" in "+channelName,
		icon_url: spt.users.get(afkObj['host']).avatarURL
		}
	};

	return embed;
}

module.exports = updateEndedAFK;