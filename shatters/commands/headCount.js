const reactHC = require("../helpers/reactHc.js");
const config = require("../../config.json");

async function main(spt, data){
	const afkCheckChannel = spt.channels.get(config.shatters.afkcheckID);
	data.channel.send(`Started a headcount.`)
	const embed = { "title": "**Headcount for Shatters started by "+data.guild.members.get(data.author.id).displayName+"!**", "color": 3035140, "timestamp": new Date(data.createdTimestamp).toISOString(), "description": "React with "+spt.emojis.find(emoji => emoji.name === "shatters")+" to participate and "+spt.emojis.find(emoji => emoji.name === "shatterskey")+" if you have a key and are willing to pop!" };
	afkCheckChannel.send("@here")
	.then(async function (mentionHere) {
		await mentionHere.delete();
	})
	afkCheckChannel.send({ embed })
	.then(async function (headcount) {
		await reactHC(spt, headcount);
	});
}

module.exports = main;