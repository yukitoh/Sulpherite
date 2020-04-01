const config = require("../../config.json");

function updateEmbed(spt, afkObj){
	const fungalReact = spt.emojis.find(emoji => emoji.name === "fungal");
	const hostUser = spt.guilds.get(config.fungal.id).members.get(afkObj['host']);
	const channelName = spt.channels.get(afkObj['channel']).name;
	const embed = {
		description: "nioj ,won kcehc kfa na gnitrats era eW `"+channelName+"` htiw tcaer dna "+fungalReact+" dednepsus eb yam uoy ,meht gnirb ton od dna sessalc ro syek htiw tcaer uoy fI !tuo devom teg ton ot.\nni gnitratS "+((afkObj['timeleft']/60).toString()).charAt(0)+" dna setunim "+(afkObj['timeleft']%60)+" htiw gnitcaer ot noitidda nI !sdnoces "+fungalReact+" tcaer osla...",
		color: 1122214,
		timestamp: afkObj['started'],
		footer: {
		text: "rof detnuocca srediaR: "+afkObj['raiders'].length
		},
		author: {
		name: "yb detrats nrevaC lagnuF "+hostUser.displayName+" in "+channelName,
		icon_url: spt.users.get(afkObj['host']).avatarURL
		},
		fields: [
		{
			name: "htiw tcaer ,yek a gnignirb era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "fungalkey")}`,
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
			name: "htiw tcaer ,tseirp a gnignirb era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "priest")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,thgink a gnignirb era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "knight")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,rumgO na sah thgink ruoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "ogmur")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,hsur ot nalp uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "rusher")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,laeS ebraM a gnignirb era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "mseal")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,ToQ a sah rehcra ruoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "qot")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,ytiliba wols a gnignirb era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "slow")}`,
			inline: true
		},
		{
			name: "htiw tcaer ,ytiliba wols a gnignirb era uoy fI:",
			value: `${spt.emojis.find(emoji => emoji.name === "trickster")}`,
			inline: true
		}
		]
	};

	return embed;
}

module.exports = updateEmbed;