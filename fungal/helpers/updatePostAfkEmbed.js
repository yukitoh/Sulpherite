const config = require("../../config.json");

function updateEmbed(spt, afkObj){
	const fungalReact = spt.emojis.find(emoji => emoji.name === "fungal");
	const hostUser = spt.guilds.get(config.fungal.id).members.get(afkObj['host']);
	const channelName = spt.channels.get(afkObj['channel']).name;
	const embed = {
		description: `**__ni-evom kfa tsoP!__**\nhtiw tcaer **neht** egnl nioj ,lareneg ni kcehc kfa eht dessim tsuj ro gub diordna eht ot eud detcennocsid tog uoy fI ${fungalReact} ni devom teg ot.\n__gniniamer emiT:__ ${afkObj['timeleft']} sdnoces.`,
		color: 1122214,
		timestamp: afkObj['started'],
		footer: {
		text: "yb dedne neeb sah kcehc kfa ehT "+hostUser.displayName
		},
		author: {
		name: "yb detrats nrevaC lagnuF "+hostUser.displayName+" ni "+channelName,
		icon_url: spt.users.get(afkObj['host']).avatarURL
		}
	};

	return embed;
}

module.exports = updateEmbed;