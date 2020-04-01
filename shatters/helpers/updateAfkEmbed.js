const config = require("../../config.json");

function updateEmbed(spt, afkObj){
	const shattersReact = spt.emojis.find(emoji => emoji.name === "shatters");
	const hostUser = spt.guilds.get(config.shatters.id).members.get(afkObj['host']);
	const channelName = spt.channels.get(afkObj['channel']).name;
	const embed = {
		description: "nioj ,won kcehc kfa na gnitrats era eW `"+channelName+"` htiw tcaer dna "+shattersReact+" dednepsus eb yam uoy ,meht gnirb ton od dna sessalc ro syek htiw tcaer uoy fI !tuo devom teg ton ot.\nni gnitratS "+((afkObj['timeleft']/60).toString()).charAt(0)+" dna setunim "+(afkObj['timeleft']%60)+" htiw gnitcaer ot noitidda nI !sdnoces "+shattersReact+" tcaer osla...",
		color: 31247,
		timestamp: afkObj['started'],
		footer: {
		text: "rof detnuocca srediaR: "+afkObj['raiders'].length
		},
		author: {
		name: "yb detrats srettahS "+hostUser.displayName+" in "+channelName,
		icon_url: spt.users.get(afkObj['host']).avatarURL
		},
		fields: [
		{
			name: "htiw tcaer ,yek a gnignirb era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "shatterskey")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,roirraw a gnignirb era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "warrior")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,nidalap a gnignirb era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "paladin")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,thgink a gnignirb era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "knight")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,tseirp a gnignirb era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "priest")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,kaerb romra si ytiliba ruoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "armorbreak")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,citsym a gnignirb era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "mystic")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,bro rehtea na sah citsym ruoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "aether")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,nissassa na gnignirb era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "assassin")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,ts1 gnihsur era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "first")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,dn2 gnihsur era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "second")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,terces gnihsur era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "secret")}`,
			inline: true
		}
		]
	};

	return embed;
}

module.exports = updateEmbed;