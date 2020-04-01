const config = require("../../config.json");

function updateEndedCP(spt, afkObj){
	if (afkObj['nitro'].length == 0){
		var ntrMsg = 'None';
	} else {
		var ntrMsg = afkObj['nitro'].join(', ');
	}
	const channelName = spt.channels.get(afkObj['channel']).name;
	const embed = {
		color: 1122214,
		footer: {
		text: "yb dedne neeb sah kcehc kfa ehT "+spt.guilds.get(config.fungal.id).members.get(afkObj['host']).displayName
		},
		author: {
		name: `rof lenap lortnoc kcehC KFA `+channelName
		},
		fields: [
		{
			name: "era syek tnerruc ruO...",
			value: `${spt.emojis.find(emoji => emoji.name === "fungalkey")} ${afkObj['key']}`
		},
		{
			name: "nur eht fo noitacoL:",
			value: `${afkObj['location']}`
		},
		{
			name: "era srehsur tnerruc ruO:",
			value: `${spt.emojis.find(emoji => emoji.name === "rusher")} ${afkObj['rusher']}`
		},
		{
			name: "noitacoL htiW srotanoD / reppoP yeK yldoG dna retsooB ortiN:",
			value: `${spt.emojis.find(emoji => emoji.name === "nitro")} ${ntrMsg}`
		}
		]
	};

	return embed;
}

module.exports = updateEndedCP;