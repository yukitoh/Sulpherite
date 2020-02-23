const ping = require('node-http-ping')
const unlockChannel = require("./helpers/unlockChannel.js");
const lockChannel = require("./helpers/lockChannel.js");
const config = require("../config.json");
const isRaidleader = require('../isRL.js');

var skipPromise = [];
var skipPromiseDeaf = [];
const afkChecksPromises = [];
const afkChecks = [];
const warnedDeafs = [];

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
				//require("./commands/parsemembers.js")(spt, data, args)
				data.channel.send(`Deactivated, takes too much memory, looking for an alternative.`);
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
					.then(async function(time){
						var start = new Date()
						await data.channel.send(`Checking..`)
							.then(async function(msg){
								var end = new Date() - start;
								msg.edit(`Bot Latency: ${end}ms, API Latency: ${time}ms`);
							})
					})
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

async function updateAfkObjs(spt, log){
	// pass promises to objects
	resolveAfks(afkChecksPromises);
	// update every afk check object
	for (x in afkChecks) {
		// handle aborts
		if (afkChecks[x]['aborted'] == false) {
			if (afkChecks[x]['ended'] == false){
				// not ended -> update
				if (log) afkChecks[x]['timeleft'] -= 5;
				if (afkChecks[x]['timeleft'] <= 0){
					// Endings:
					if (afkChecks[x]['postafk'] == false){
						afkChecks[x]['postafk'] = true;
						afkChecks[x]['timeleft'] = 30;
						await spt.channels.get(afkChecks[x]['channel']).setName(`raiding`+afkChecks[x]['channelNumber']);
						await spt.channels.get(afkChecks[x]['channel']).overwritePermissions(spt.guilds.get(config.shatters.id).roles.find(role => role.name == config.shatters.raiderRole), { 'CONNECT': false, 'SPEAK': false });
						
						// move to lounge people who didn't react with portal
						var vcRaiders = [];
						var reactedPortal = [];
						spt.channels.get(afkChecks[x]['channel']).members.forEach(async function(raiders){
							await vcRaiders.push(raiders);
						})
						spt.channels.get(config.shatters.afkcheckID).fetchMessage(afkChecks[x]['afkcheck'])
							.then(async function (afkmsg) {
								const reactPortal = afkmsg.reactions.get('shatters:679186863264628736');
								try {
									for (const user of reactPortal.users.values()) {
										reactedPortal.push(user.id);
									}
								} catch (error) {/*no users reaction left*/}
								vcRaiders.forEach(async function(vcr){
									// if rl, do not move out
									await isRaidleader(spt, 'shatters', vcr.user.id).then(async function(value){
										await isRLPromise.push(value);
									})
									if (!reactedPortal.includes(vcr.user.id) && !isRLPromise[0]){
										await vcr.setVoiceChannel(spt.channels.get(config.shatters.vcs.lounge));
									}
								})
							})
					} else {
						afkChecks[x]['ended'] = true;
					}
				} else {
					// Update cp & afk for normal & post
					if (afkChecks[x]['postafk'] == true){
						// postafk update
						spt.channels.get(config.shatters.rlBotChannelID).fetchMessage(afkChecks[x]['controlpanel'])
							.then(async function (cpmsg) {
								let embed = require("./helpers/updatePostCPEmbed.js")(spt, afkChecks[x]);
								await cpmsg.edit({ embed: embed });
								const reactX = cpmsg.reactions.get('❌');
								try {
									for (const user of reactX.users.values()) {
									await reactX.remove(user);
									}
								} catch (error) {/*no users reaction left*/}
							})
						spt.channels.get(config.shatters.afkcheckID).fetchMessage(afkChecks[x]['afkcheck'])
							.then(async function (afkmsg) {
								let embed = require("./helpers/updatePostAfkEmbed.js")(spt, afkChecks[x]);
								await afkmsg.edit({ embed: embed });
							})
					} else {
						// normal update
						spt.channels.get(config.shatters.rlBotChannelID).fetchMessage(afkChecks[x]['controlpanel'])
							.then(async function (cpmsg) {
								let embed = require("./helpers/updateControlPanel.js")(spt, afkChecks[x]);
								await cpmsg.edit({ embed: embed })
							})
						spt.channels.get(config.shatters.afkcheckID).fetchMessage(afkChecks[x]['afkcheck'])
							.then(async function (afkmsg) {
								let embed = require("./helpers/updateAfkEmbed.js")(spt, afkChecks[x]);
								await afkmsg.edit("@here Shatters ("+spt.emojis.find(emoji => emoji.name === "shatters")+") started by <@!"+afkChecks[x]['host']+"> in `"+spt.channels.get(afkChecks[x]['channel']).name+"`", { embed: embed });
							})
					}
				}
			} else {
				// ended final update
				spt.channels.get(config.shatters.rlBotChannelID).fetchMessage(afkChecks[x]['controlpanel'])
					.then(async function (cpmsg) {
						let embed = require("./helpers/updateEndedCPEmbed.js")(spt, afkChecks[x]);
						await cpmsg.edit({ embed: embed });
					})
				spt.channels.get(config.shatters.afkcheckID).fetchMessage(afkChecks[x]['afkcheck'])
					.then(async function (afkmsg) {
						let embed = require("./helpers/updateEndedAfkEmbed.js")(spt, afkChecks[x]);
						// safety
						lockChannel(spt, afkmsg, afkChecks[x]['channelNumber'], false);
						await afkmsg.edit({ embed: embed });
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
			spt.channels.get(config.shatters.rlBotChannelID).fetchMessage(afkChecks[x]['controlpanel'])
				.then(async function (cpmsg) {
					let embed = require("./helpers/updateAbortedCPEmbed.js")(spt, afkChecks[x]);
					await cpmsg.edit({ embed: embed });
					const reactX = cpmsg.reactions.get('❌');
					try {
						for (const user of reactX.users.values()) {
						await reactX.remove(user);
						}
					} catch (error) {/*no users reaction left*/}
				})
			spt.channels.get(config.shatters.afkcheckID).fetchMessage(afkChecks[x]['afkcheck'])
				.then(async function (afkmsg) {
					let embed = require("./helpers/updateAbortedAfkEmbed.js")(spt, afkChecks[x]);
					lockChannel(spt, afkmsg, afkChecks[x]['channelNumber'], false);
					await afkmsg.edit({ embed: embed });
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

async function checkDeafen(spt){
	if (spt.channels.get(config.shatters.vcs.one).members.size > 0){
		spt.channels.get(config.shatters.vcs.one).members.forEach(async function(raiders){
			await isRaidleader(spt, 'shatters', raiders.id).then(async function(value){
				await skipPromiseDeaf.push(value);
			})
			if (raiders.deaf && !warnedDeafs.includes(raiders) && !skipPromiseDeaf[0]){
				raiders.send(`You have deafened yourself in a raiding vc. If you do not undeafen yourself in the next 30 seconds, you will be suspended! If you must deafen yourself, leave the raiding vc and **leave the run** or else you will be suspended for crashing.`)
				spt.channels.get(config.shatters.rlBotChannelID).send(`${raiders} deafened himself, if they do not undeafen in the next 30 seconds, you can suspend them.`);
				warnedDeafs.push(raiders);
			}

			skipPromiseDeaf.length = 0;
		})
	}
	if (spt.channels.get(config.shatters.vcs.two).members.size > 0){
		spt.channels.get(config.shatters.vcs.two).members.forEach(async function(raiders){
			await isRaidleader(spt, 'shatters', raiders.id).then(async function(value){
				await skipPromiseDeaf.push(value);
			})
			if (raiders.deaf && !warnedDeafs.includes(raiders) && !skipPromiseDeaf[0]){
				raiders.send(`You have deafened yourself in a raiding vc. If you do not undeafen yourself in the next 30 seconds, you will be suspended! If you must deafen yourself, leave the raiding vc and **leave the run** or else you will be suspended for crashing.`)
				spt.channels.get(config.shatters.rlBotChannelID).send(`${raiders} deafened himself, if they do not undeafen in the next 30 seconds, you can suspend them.`);
				warnedDeafs.push(raiders);
			}

			skipPromiseDeaf.length = 0;
		})
	}
	if (spt.channels.get(config.shatters.vcs.three).members.size > 0){
		spt.channels.get(config.shatters.vcs.three).members.forEach(async function(raiders){
			await isRaidleader(spt, 'shatters', raiders.id).then(async function(value){
				await skipPromiseDeaf.push(value);
			})
			if (raiders.deaf && !warnedDeafs.includes(raiders) && !skipPromiseDeaf[0]){
				raiders.send(`You have deafened yourself in a raiding vc. If you do not undeafen yourself in the next 30 seconds, you will be suspended! If you must deafen yourself, leave the raiding vc and **leave the run** or else you will be suspended for crashing.`)
				spt.channels.get(config.shatters.rlBotChannelID).send(`${raiders} deafened himself, if they do not undeafen in the next 30 seconds, you can suspend them.`);
				warnedDeafs.push(raiders);
			}

			skipPromiseDeaf.length = 0;
		})
	}
	if (spt.channels.get(config.shatters.vcs.four).members.size > 0){
		spt.channels.get(config.shatters.vcs.four).members.forEach(async function(raiders){
			await isRaidleader(spt, 'shatters', raiders.id).then(async function(value){
				await skipPromiseDeaf.push(value);
			})
			if (raiders.deaf && !warnedDeafs.includes(raiders) && !skipPromiseDeaf[0]){
				raiders.send(`You have deafened yourself in a raiding vc. If you do not undeafen yourself in the next 30 seconds, you will be suspended! If you must deafen yourself, leave the raiding vc and **leave the run** or else you will be suspended for crashing.`)
				spt.channels.get(config.shatters.rlBotChannelID).send(`${raiders} deafened himself, if they do not undeafen in the next 30 seconds, you can suspend them.`);
				warnedDeafs.push(raiders);
			}

			skipPromiseDeaf.length = 0;
		})
	}
	if (spt.channels.get(config.shatters.vcs.five).members.size > 0){
		spt.channels.get(config.shatters.vcs.five).members.forEach(async function(raiders){
			await isRaidleader(spt, 'shatters', raiders.id).then(async function(value){
				await skipPromiseDeaf.push(value);
			})
			if (raiders.deaf && !warnedDeafs.includes(raiders) && !skipPromiseDeaf[0]){
				raiders.send(`You have deafened yourself in a raiding vc. If you do not undeafen yourself in the next 30 seconds, you will be suspended! If you must deafen yourself, leave the raiding vc and **leave the run** or else you will be suspended for crashing.`)
				spt.channels.get(config.shatters.rlBotChannelID).send(`${raiders} deafened himself, if they do not undeafen in the next 30 seconds, you can suspend them.`);
				warnedDeafs.push(raiders);
			}

			skipPromiseDeaf.length = 0;
		})
	}

	warnedDeafs.forEach(async function(warnedraider){
		if (!warnedraider.deaf){
			const index = warnedDeafs.indexOf(warnedraider);
			if (index > -1) {
				warnedDeafs.splice(index, 1);
			}
		}
	})
}

module.exports.main = main;
module.exports.afkChecksPromises = afkChecksPromises;
module.exports.afkChecks = afkChecks;
module.exports.updateAfkObjs = updateAfkObjs;
module.exports.checkDeafen = checkDeafen;