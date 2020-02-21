const config = require("../../config.json");

async function reactHc(spt, hc){
	await hc.react(spt.emojis.find(emoji => emoji.name === "shatters"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "shatterskey"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "warrior"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "paladin"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "knight"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "priest"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "armorbreak"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "mystic"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "aether"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "assassin"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "first"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "second"));
	await hc.react(spt.emojis.find(emoji => emoji.name === "secret"));
}

module.exports = reactHc;