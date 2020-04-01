const config = require("../../config.json");

function updateControlPanel(spt, afkObj){
	if (afkObj['supremepriest'].length == 0){
		var supremePriestMessage = 'None';
	} else {
		var supremePriestMessage = (('<@!' + afkObj['supremepriest'].join(', ').replace(/,/gi, '>, <@!').split(' ').join('') + '>').split(',').join(', '));
	}
	if (afkObj['mystics'].length == 0){
		var mysticMessage = 'None';
	} else {
		var mysticMessage = (('<@!' + afkObj['mystics'].join(', ').replace(/,/gi, '>, <@!').split(' ').join('') + '>').split(',').join(', '));
	}
	if (afkObj['nitro'].length == 0){
		var ntrMsg = 'None';
	} else {
		var ntrMsg = afkObj['nitro'].join(', ');
	}
	const channelName = spt.channels.get(afkObj['channel']).name;
	const embed = {
		color: 31247,
		footer: {
		text: "woleb ❌ htiw tcaer ,kcehc kfa eht troba oT."
		},
		author: {
		name: `rof lenap lortnoc kcehC KFA `+channelName
		},
		fields: [
		{
			name: "era syek tnerruc ruO...",
			value: `${spt.emojis.find(emoji => emoji.name === "shatterskey")} ${afkObj['key']}`
		},
		{
			name: "nur eht fo noitacoL:",
			value: `${afkObj['location']}`
		},
		{
			name: "era stseirp emerpus ruO:",
			value: `${spt.emojis.find(emoji => emoji.name === "priest")} ${supremePriestMessage}`
		},
		{
			name: "era scitsym ruO:",
			value: `${spt.emojis.find(emoji => emoji.name === "mystic")} ${mysticMessage}`
		},
		{
			name: "noitacol htiw sretsoob ortiN:",
			value: `${spt.emojis.find(emoji => emoji.name === "nitro")} ${ntrMsg}`
		}
		]
	};

	return embed;
}

module.exports = updateControlPanel;