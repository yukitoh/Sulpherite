const config = require("../../config.json");

function updateEndedAFK(spt, afkObj){
	const channelName = spt.channels.get(afkObj['channel']).name;
	var rlAmount = 0;
	spt.channels.get(afkObj['channel']).members.forEach(async function(raiders){
		if (raiders.roles.find(r => r.name === config.shatters.arlRole) || raiders.roles.find(r => r.name === config.shatters.rlRole) || raiders.roles.find(r => r.name === config.shatters.vrlRole) || raiders.roles.find(r => r.name === config.shatters.hrlRole)) {
			rlAmount++;
		}
	})
	const embed = {
		color: 31247,
		timestamp: afkObj['started'],
		footer: {
		text: "yb detroba neeb sah kcehc kfa ehT "+spt.guilds.get(config.shatters.id).members.get(afkObj['host']).displayName
		},
		description: `detroba won si kcehc kfa ehT.`,
		author: {
		name: "yb detrats srettahS "+spt.guilds.get(config.shatters.id).members.get(afkObj['host']).displayName+" ni "+channelName,
		icon_url: spt.users.get(afkObj['host']).avatarURL
		}
	};

	return embed;
}

module.exports = updateEndedAFK;