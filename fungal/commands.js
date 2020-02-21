const ping = require('node-http-ping')
const unlockChannel = require("./helpers/unlockChannel.js");
const lockChannel = require("./helpers/lockChannel.js");
const config = require("../config.json");

const afkChecksPromises = [];
const afkChecks = [];

async function main(spt, data){
	let lowerData = data.content.toLowerCase();
	let args = lowerData.split(' ');
	if(await isCommand(data)){
		switch ((args[0].replace('*', ''))){
			// Main commands
			case 'headcount': case 'hc':
				require("./commands/headCount.js")(spt, data);
				break;
			case 'clean': case 'clear':
				require("./helpers/clearChannel.js")(spt, data, args, true);
				break;
			case 'unlock':
				unlockChannel(spt, data, args[1], true);
				break;
			case 'reset': case 'resetChannel': case 'lock':
				lockChannel(spt, data, args[1], true);
				break;
			case 'parsemembers': case 'parse': case 'pm':
				require("./commands/parsemembers.js")(spt, data, args)
				break;
			case 'afk':
			// CREATES AFK CHECK
				var afkc = require("./commands/createAfkCheck.js")(spt, data, args);
				if (afkc != undefined){
					afkChecksPromises.push(afkc);
				}
				break;
			// Miscellanious
			case 'ping':
				ping('https://google.com')
					.then(time => data.channel.send(`Bot Latency: ${time}ms`))
				break;
			case 'avatar':
				require("./commands/avatar.js")(spt, data);
				break;
			case 'commands':
				if (args[1] != undefined){
					require("./commands/commandsHelp.js")(spt, data.channel, args[1]);
					break;
				} else {
					const embed = { "title": "***All the commands you can use on your server!***", "color": 2672880, "footer": { "text": "Capitalization does not matter when using the commands." }, "fields": [ { "name": "**__Raiding:__**", "value": "```fix\nafk; clean; headcount; resetChannel; unlock; parsemembers```"}, { "name": "**__Miscellaneous:__**", "value": "```fix\navatar; commands; slurp; ping```\n-> dm skrillergg if you need a new command.\nTo learn more about a command, use the command *commands <command name>" } ] };
					data.channel.send({ embed });
					break;
				}
			//
		}
	}
}

module.exports.main = main;
module.exports.afkChecksPromises = afkChecksPromises;
module.exports.afkChecks = afkChecks;
module.exports.updateAfkObjs = updateAfkObjs;

async function isCommand(data){
	if(data.content.split(' ')[0].startsWith('*')){
		return true;
	} else {
		return false;
	}
}

async function resolveAfks(afkChecksPromises){
	if (afkChecksPromises.length > 0){
		afkChecksPromises.forEach(async function (afk){
			afk.then(async function (resAfK){
				afkChecks.push(resAfK);
			})
			const index = afkChecksPromises.indexOf(afk);
			if (index > -1) {
				afkChecksPromises.splice(index, 1);
			}
		})
	}
}

async function updateAfkObjs(spt){
	// pass promises to objects
	resolveAfks(afkChecksPromises);
	// update every afk check object
	for (x in afkChecks) {	
		// handle aborts
		if (afkChecks[x]['aborted'] == false) {
			if (afkChecks[x]['ended'] == false){
				// not ended -> update
				afkChecks[x]['timeleft'] -= 5;
				if (afkChecks[x]['timeleft'] <= 0){
					// Endings:
					if (afkChecks[x]['postafk'] == false){
						afkChecks[x]['postafk'] = true;
						afkChecks[x]['timeleft'] = 30;
						await spt.channels.get(afkChecks[x]['channel']).setName(`raiding`+afkChecks[x]['channelNumber']);
						await spt.channels.get(afkChecks[x]['channel']).overwritePermissions(spt.guilds.get(config.fungal.id).roles.find(role => role.name == config.fungal.raiderRole), { 'CONNECT': false, 'SPEAK': false });
						// TODO: Move out everyone who didn't react with fungal portal
					} else {
						afkChecks[x]['ended'] = true;
					}
				} else {
					// Update cp & afk for normal & post
					if (afkChecks[x]['postafk'] == true){
						// postafk update
						spt.channels.get(config.fungal.rlBotChannelID).fetchMessage(afkChecks[x]['controlpanel'])
							.then(async function (cpmsg) {
								let embed = require("./helpers/updatePostCPEmbed.js")(spt, afkChecks[x]);
								await cpmsg.edit({ embed: embed });
								//TODO: fix, doesn't remove reaction
								const reactX = cpmsg.reactions.get('❌');
								try {
									for (const user of reactX.users.values()) {
									await reactX.remove(user);
									}
								} catch (error) {/*no users reaction left*/}
							})
						spt.channels.get(config.fungal.afkcheckID).fetchMessage(afkChecks[x]['afkcheck'])
							.then(async function (afkmsg) {
								let embed = require("./helpers/updatePostAfkEmbed.js")(spt, afkChecks[x]);
								await afkmsg.edit({ embed: embed });
							})
					} else {
						// normal update
						spt.channels.get(config.fungal.rlBotChannelID).fetchMessage(afkChecks[x]['controlpanel'])
							.then(async function (cpmsg) {
								let embed = require("./helpers/updateControlPanel.js")(spt, afkChecks[x]);
								await cpmsg.edit({ embed: embed })
							})
						spt.channels.get(config.fungal.afkcheckID).fetchMessage(afkChecks[x]['afkcheck'])
							.then(async function (afkmsg) {
								let embed = require("./helpers/updateAfkEmbed.js")(spt, afkChecks[x]);
								await afkmsg.edit("@here Fungal Cavern ("+spt.emojis.find(emoji => emoji.name === "fungal")+") started by <@!"+afkChecks[x]['host']+"> in `"+spt.channels.get(afkChecks[x]['channel']).name+"`", { embed: embed });
							})
					}
				}
			} else {
				// ended final update
				spt.channels.get(config.fungal.rlBotChannelID).fetchMessage(afkChecks[x]['controlpanel'])
					.then(async function (cpmsg) {
						let embed = require("./helpers/updateEndedCPEmbed.js")(spt, afkChecks[x]);
						await cpmsg.edit({ embed: embed });
					})
				spt.channels.get(config.fungal.afkcheckID).fetchMessage(afkChecks[x]['afkcheck'])
					.then(async function (afkmsg) {
						let embed = require("./helpers/updateEndedAfkEmbed.js")(spt, afkChecks[x]);
						// safety
						lockChannel(spt, afkmsg, afkChecks[x]['channelNumber'], false);
						await afkmsg.edit({ embed: embed });
						//TODO: fix, doesn't remove reaction
						const reactX = afkmsg.reactions.get('❌');
						try {
							for (const user of reactX.users.values()) {
							await reactX.remove(user);
							}
						} catch (error) {/*no users reaction left*/}
						// remove afkObj from array
						const index = afkChecks.indexOf(afkChecks[x]);
						if (index > -1) {
							afkChecks.splice(index, 1);
						}
					})
			}
		} else {
			// abort control panel & afk check
			spt.channels.get(config.fungal.rlBotChannelID).fetchMessage(afkChecks[x]['controlpanel'])
				.then(async function (cpmsg) {
					let embed = require("./helpers/updateAbortedCPEmbed.js")(spt, afkChecks[x]);
					await cpmsg.edit({ embed: embed });
					//TODO: fix, doesn't remove reaction
					const reactX = cpmsg.reactions.get('❌');
					try {
						for (const user of reactX.users.values()) {
						await reactX.remove(user);
						}
					} catch (error) {/*no users reaction left*/}
				})
			spt.channels.get(config.fungal.afkcheckID).fetchMessage(afkChecks[x]['afkcheck'])
				.then(async function (afkmsg) {
					let embed = require("./helpers/updateAbortedAfkEmbed.js")(spt, afkChecks[x]);
					lockChannel(spt, afkmsg, afkChecks[x]['channelNumber'], false);
					await afkmsg.edit({ embed: embed });
					//TODO: fix, doesn't remove reaction
					const reactX = afkmsg.reactions.get('❌');
					try {
						for (const user of reactX.users.values()) {
						await reactX.remove(user);
						}
					} catch (error) {/*no users reaction left*/}
					// remove afkObj from array
					const index = afkChecks.indexOf(afkChecks[x]);
					if (index > -1) {
						afkChecks.splice(index, 1);
					}

				})
		}
	}
}