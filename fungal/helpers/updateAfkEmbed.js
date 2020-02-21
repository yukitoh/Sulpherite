const config = require("../../config.json");

function updateEmbed(spt, afkCheckObj){
	const fungalReact = spt.emojis.find(emoji => emoji.name === "fungal");
	const hostUser = spt.guilds.get(config.fungal.id).members.get(afkCheckObj['host']);
	const channelName = spt.channels.get(afkCheckObj['channel']).name;
	const embed = {
		description: "We are starting an afk check now, join `"+channelName+"` and react with "+fungalReact+" to not get moved out! If you react with keys or classes and do not bring them, you may be suspended.\nStarting in "+((afkCheckObj['timeleft']/60).toString()).charAt(0)+" minutes and "+(afkCheckObj['timeleft']%60)+" seconds! In addition to reacting with "+fungalReact+" also react...",
		color: 1122214,
		timestamp: afkCheckObj['started'],
		footer: {
		text: "Raiders accounted for: "+afkCheckObj['raiders']
		},
		author: {
		name: "Fungal Cavern started by "+hostUser.displayName+" in "+channelName,
		icon_url: spt.users.get(afkCheckObj['host']).avatarURL
		},
		fields: [
		{
			name: "If you are bringing a key, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "fungalkey")}`,
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
			name: "If you are bringing a priest, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "priest")}`,
			inline: true
		},
		{
			name: "If you are bringing a knight, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "knight")}`,
			inline: true
		},
		{
			name: "If your knight has an Ogmur, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "ogmur")}`,
			inline: true
		},
		{
			name: "If you plan to rush, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "rusher")}`,
			inline: true
		},
		{
			name: "If you are bringing a Marbe Seal, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "mseal")}`,
			inline: true
		},
		{
			name: "If your archer has a QoT, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "qot")}`,
			inline: true
		},
		{
			name: "If you are bringing a slow ability, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "slow")}`,
			inline: true
		},
		{
			name: "If you are bringing a trickster, react with:",
			value: `${spt.emojis.find(emoji => emoji.name === "trickster")}`,
			inline: true
		}
		]
	};

	return embed;
}

module.exports = updateEmbed;