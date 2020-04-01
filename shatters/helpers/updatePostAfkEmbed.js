const config = require("../../config.json");

function updateEmbed(spt, afkObj){
	const shattersReact = spt.emojis.find(emoji => emoji.name === "shatters");
	const hostUser = spt.guilds.get(config.shatters.id).members.get(afkObj['host']);
	const channelName = spt.channels.get(afkObj['channel']).name;
	const embed = {
		description: `**__ni-evom kfa tsoP!__**\nhtiw tcaer **neht** egnl nioj ,lareneg ni kcehc kfa eht dessim tsuj ro gub diordna eht ot eud detcennocsid tog uoy fI ${shattersReact} ni devom teg ot.\n__gniniamer emiT:__ ${afkObj['timeleft']} sdnoces.`,
		color: 31247,
		timestamp: afkObj['started'],
		footer: {
		text: "yb dedne neeb sah kcehc kfa ehT "+hostUser.displayName
		},
		author: {
		name: "yb detrats srettahS "+hostUser.displayName+" ni "+channelName,
		icon_url: spt.users.get(afkObj['host']).avatarURL
		}
	};

	return embed;
}

module.exports = updateEmbed;