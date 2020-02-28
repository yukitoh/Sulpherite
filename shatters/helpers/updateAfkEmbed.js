const config = require("../../config.json");

function updateEmbed(spt, afkObj){
	const shattersReact = spt.emojis.find(emoji => emoji.name === "shatters");
	const hostUser = spt.guilds.get(config.shatters.id).members.get(afkObj['host']);
	const channelName = spt.channels.get(afkObj['channel']).name;
	const embed = {
		description: "Estamos empezando un chequeo afk ahora, únete raiding `"+channelName+"` y reaccionar con "+shattersReact+" para no ser movido! Si reaccionas con llaves o clases y no las traes, puedes ser suspendido.\nEmpezando en "+((afkObj['timeleft']/60).toString()).charAt(0)+" minutos y "+(afkObj['timeleft']%60)+" ¡segundos! Además de reaccionar con "+shattersReact+" también reaccionan...",
		color: 31247,
		timestamp: afkObj['started'],
		footer: {
		text: "Raiders accounted for: "+afkObj['raiders'].length
		},
		author: {
		name: "Shatters started by "+hostUser.displayName+" in "+channelName,
		icon_url: spt.users.get(afkObj['host']).avatarURL
		},
		fields: [
		{
			name: "If you are bringing a key, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "shatterskey")}`,
			inline: true
		},
		{
			name: "If you are bringing a warrior, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "warrior")}`,
			inline: true
		},
		{
			name: "If you are bringing a paladin, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "paladin")}`,
			inline: true
		},
		{
			name: "If you are bringing a knight, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "knight")}`,
			inline: true
		},
		{
			name: "If you are bringing a priest, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "priest")}`,
			inline: true
		},
		{
			name: "If your ability is armor break, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "armorbreak")}`,
			inline: true
		},
		{
			name: "If you are bringing a mystic, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "mystic")}`,
			inline: true
		},
		{
			name: "If your mystic has an aether orb, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "aether")}`,
			inline: true
		},
		{
			name: "If you are bringing an assassin, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "assassin")}`,
			inline: true
		},
		{
			name: "If you are rushing 1st, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "first")}`,
			inline: true
		},
		{
			name: "If you are rushing 2nd, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "second")}`,
			inline: true
		},
		{
			name: "If you are rushing secret, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "secret")}`,
			inline: true
		}
		]
	};

	return embed;
}

module.exports = updateEmbed;