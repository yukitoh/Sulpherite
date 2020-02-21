const config = require("../../config.json");

function updateEndedAFK(spt, afkCheckObj){
	const channelName = spt.channels.get(afkCheckObj['channel']).name;
	var rlAmount = 0;
	spt.channels.get(afkCheckObj['channel']).members.forEach(async function(raiders){
		if (raiders.roles.find(r => r.name === config.fungal.arlRole) || raiders.roles.find(r => r.name === config.fungal.rlRole) || raiders.roles.find(r => r.name === config.fungal.vrlRole) || raiders.roles.find(r => r.name === config.fungal.hrlRole)) {
			rlAmount++;
		}
	})
	const embed = {
		color: 1122214,
		timestamp: afkCheckObj['started'],
		footer: {
		text: "The afk check has been aborted by "+spt.guilds.get(config.fungal.id).members.get(afkCheckObj['host']).displayName
		},
		description: `The afk check is now aborted.`,
		author: {
		name: "Fungal Cavern started by "+spt.guilds.get(config.fungal.id).members.get(afkCheckObj['host']).displayName+" in "+channelName,
		icon_url: spt.users.get(afkCheckObj['host']).avatarURL
		}
	};

	return embed;
}

module.exports = updateEndedAFK;