const config = require("../../config.json");

async function reactAFKCHECK(spt, afk){
	await afk.react(spt.emojis.find(emoji => emoji.name === "shatters"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "shatterskey"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "warrior"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "paladin"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "knight"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "priest"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "armorbreak"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "mystic"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "aether"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "assassin"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "first"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "second"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "secret"));
	await afk.react(spt.emojis.find(emoji => emoji.name === "nitro"));
	await afk.react("❌");
}

module.exports = reactAFKCHECK;