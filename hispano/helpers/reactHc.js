const config = require("../../config.json");

async function reactHc(spt, hc){
	await hc.react(spt.emojis.find(emoji => emoji.name === "fungal"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "fungalkey"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "warrior"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "paladin"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "priest"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "knight"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "ogmur"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "rusher"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "mseal"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "qot"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "slow"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "trickster"));
}

module.exports = reactHc;