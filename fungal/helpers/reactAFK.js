const config = require("../../config.json");

async function reactAFKCHECK(spt, afk){
	await afk.react(spt.emojis.find(emoji => emoji.name === "fungal"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "fungalkey"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "warrior"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "paladin"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "priest"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "knight"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "ogmur"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "rusher"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "mseal"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "qot"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "slow"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "trickster"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "nitro"));
	await afk.react("❌");
}

module.exports = reactAFKCHECK;