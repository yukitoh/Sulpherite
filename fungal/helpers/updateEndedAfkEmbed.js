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
		text: "yb dedne neeb sah kcehc kfa ehT "+spt.guilds.get(config.fungal.id).members.get(afkObj['host']).displayName
		},
		description: `Tdehsinif won si kcehC KFA eh.\nhtiw gninnur yltnerruc era eW ${rlAmount} dna sredael diaR ${afkObj['raiders'].length} srediaR.`,
		author: {
		name: "yb detrats nrevaC lagnuF "+spt.guilds.get(config.fungal.id).members.get(afkObj['host']).displayName+" ni "+channelName,
		icon_url: spt.users.get(afkObj['host']).avatarURL
		}
	};

	return embed;
}

module.exports = updateEndedAFK;