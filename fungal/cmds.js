const ping = require('node-http-ping')
const unlockChannel = require("./helpers/unlockChannel.js");
const lockChannel = require("./helpers/lockChannel.js");
const config = require("../config.json");
const isRL = require('../isRL.js');

var isRLPro = [];
const afkChecksPromises = [];
const afks = [];
const warnedDeafs = [];

async function main(spt, data){
	let lwData = data.content.toLowerCase();
	let args = lwData.split(' ');
	if(await isCmd(data)){
		switch ((args[0].replace('*', ''))){
			// Main cmds
			case 'headcount': case 'hc':
				require("./cmds/headCount.js")(spt, data);
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
			case 'loc': case 'location':
				require("./cmds/location.js")(spt, data, args);
				break;
			case 'parsemembers': case 'pmChan': case 'pm':
				//require("./cmds/parseMembers.js")(spt, data, args);
				data.channel.send(`Deactivated, takes too much memory, looking for an alternative.`);
				break;
			case 'afk':
			// CREATES AFK CHECK
				var afkc = require("./cmds/createAfkCheck.js")(spt, data, args);
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
				require("./cmds/avatar.js")(spt, data);
				break;
			case 'cmds': case 'commands':
				if (args[1] != undefined){
					require("./cmds/commandsHelp.js")(spt, data.channel, args[1]);
					break;
				} else {
					const embed = { "title": "***All the commands you can use on your server!***", "color": 2672880, "footer": { "text": "Capitalization does not matter when using the commands." }, "fields": [ { "name": "**__Raiding:__**", "value": "```fix\nafk; clean; headcount; resetChannel; unlock; location; parsemembers```"}, { "name": "**__Events:__**", "value": "```fix\ncleanevent; headcount(not yet); resetevent; unlockevent```"}, { "name": "**__Miscellaneous:__**", "value": "```fix\navatar; commands; slurp; ping```\n-> dm skrillergg if you need a new command.\nTo learn more about a command, use the command *commands <command name>" } ] };
					data.channel.send({ embed });
					break;
				}
			//
		}
	}
}

async function isCmd(data){
	if(data.content.split(' ')[0].startsWith(config.pfx)){
		return true;
	} else {
		return false;
	}
}

async function resolveAfks(afkChecksPromises){
	if (afkChecksPromises.length > 0){
		afkChecksPromises.forEach(async function (afk){
			afk.then(async function (resAfK){
				afks.push(resAfK);
			})
			const index = afkChecksPromises.indexOf(afk);
			if (index > -1) {
				afkChecksPromises.splice(index, 1);
			}
		})
	}
}

async function updAfkObj(spt, log){
	// pass promises to objects
	resolveAfks(afkChecksPromises);
	// update every afk check object
	for (x in afks) {
		if (afks[x] == undefined) return;
		// handle aborts
		if (afks[x]['aborted'] == false) {
			if (afks[x]['ended'] == false){
				// not ended -> update
				if (log) afks[x]['timeleft'] -= 5;
				if (afks[x]['timeleft'] <= 0){
					// Endings:
					if (afks[x]['postafk'] == false){
						afks[x]['postafk'] = true;
						afks[x]['timeleft'] = 30;
						await spt.channels.get(afks[x]['channel']).setName(`raiding`+afks[x]['channelNumber']);
						await spt.channels.get(afks[x]['channel']).overwritePermissions(spt.guilds.get(config.fungal.id).roles.find(role => role.name == config.fungal.rdrRole), { 'CONNECT': false, 'SPEAK': false });
						
						// move to lnge people who didn't react with portal
						var vcRaiders = [];
						var reactedPortal = [];
						spt.channels.get(afks[x]['channel']).members.forEach(async function(raiders){
							await vcRaiders.push(raiders);
						})
						spt.channels.get(config.fungal.afkChan).fetchMessage(afks[x]['afkcheck'])
							.then(async function (afkmsg) {
								const reactPortal = afkmsg.reactions.get('fungal:680172932382720007');
								try {
									for (const user of reactPortal.users.values()) {
										reactedPortal.push(user.id);
									}
								} catch (error) {/*no users reaction left*/}
								vcRaiders.forEach(async function(vcr){
									// if rl, do not move out
									await isRL(spt, 'fungal', vcr.user.id).then(async function(value){
										await isRLPro.push(value);
									})
									if (!reactedPortal.includes(vcr.user.id) && !isRLPro[0]){
										await vcr.setVoiceChannel(spt.channels.get(config.fungal.vc.afk));
									}
								})
							})
					} else {
						afks[x]['ended'] = true;
					}
				} else {
					// Update cp & afk for normal & post
					if (afks[x]['postafk'] == true){
						// postafk update
						spt.channels.get(config.fungal.rlChan).fetchMessage(afks[x]['controlpanel'])
							.then(async function (cpmsg) {
								let embed = require("./helpers/updatePostCPEmbed.js")(spt, afks[x]);
								await cpmsg.edit({ embed: embed });
								const reactX = cpmsg.reactions.get('❌');
								try {
									for (const user of reactX.users.values()) {
									reactX.remove(user);
									}
								} catch (error) {/*no users reaction left*/}
							})
						spt.channels.get(config.fungal.afkChan).fetchMessage(afks[x]['afkcheck'])
							.then(async function (afkmsg) {
								let embed = require("./helpers/updatePostAfkEmbed.js")(spt, afks[x]);
								await afkmsg.edit({ embed: embed });
							})
					} else {
						// normal update
						spt.channels.get(config.fungal.rlChan).fetchMessage(afks[x]['controlpanel'])
							.then(async function (cpmsg) {
								let embed = require("./helpers/updateControlPanel.js")(spt, afks[x]);
								await cpmsg.edit({ embed: embed })
							})
						spt.channels.get(config.fungal.afkChan).fetchMessage(afks[x]['afkcheck'])
							.then(async function (afkmsg) {
								let embed = require("./helpers/updateAfkEmbed.js")(spt, afks[x]);
								await afkmsg.edit("@here Fungal Cavern ("+spt.emojis.find(emoji => emoji.name === "fungal")+") started by <@!"+afks[x]['host']+"> in `"+spt.channels.get(afks[x]['channel']).name+"`", { embed: embed });
							})
					}
				}
			} else {
				// ended final update
				spt.channels.get(config.fungal.rlChan).fetchMessage(afks[x]['controlpanel'])
					.then(async function (cpmsg) {
						let embed = require("./helpers/updateEndedCPEmbed.js")(spt, afks[x]);
						await cpmsg.edit({ embed: embed });
					})
				spt.channels.get(config.fungal.afkChan).fetchMessage(afks[x]['afkcheck'])
					.then(async function (afkmsg) {
						let embed = require("./helpers/updateEndedAfkEmbed.js")(spt, afks[x]);
						// safety
						lockChannel(spt, afkmsg, afks[x]['channelNumber'], false);
						await afkmsg.edit({ embed: embed });
						const reactX = afkmsg.reactions.get('❌');
						try {
							for (const user of reactX.users.values()) {
							reactX.remove(user);
							}
						} catch (error) {/*no users reaction left*/}
						// remove afkObj from array
						const index = afks.indexOf(afks[x]);
						if (index > -1) {
							afks.splice(index, 1);
						}
					})
			}
		} else {
			// abort control panel & afk check
			spt.channels.get(config.fungal.rlChan).fetchMessage(afks[x]['controlpanel'])
				.then(async function (cpmsg) {
					let embed = require("./helpers/updateAbortedCPEmbed.js")(spt, afks[x]);
					await cpmsg.edit({ embed: embed });
					const reactX = cpmsg.reactions.get('❌');
					try {
						for (const user of reactX.users.values()) {
						reactX.remove(user);
						}
					} catch (error) {/*no users reaction left*/}
				})
			spt.channels.get(config.fungal.afkChan).fetchMessage(afks[x]['afkcheck'])
				.then(async function (afkmsg) {
					let embed = require("./helpers/updateAbortedAfkEmbed.js")(spt, afks[x]);
					lockChannel(spt, afkmsg, afks[x]['channelNumber'], false);
					await afkmsg.edit({ embed: embed });
					const reactX = afkmsg.reactions.get('❌');
					try {
						for (const user of reactX.users.values()) {
						reactX.remove(user);
						}
					} catch (error) {/*no users reaction left*/}
					// remove afkObj from array
					const index = afks.indexOf(afks[x]);
					if (index > -1) {
						afks.splice(index, 1);
					}

				})
		}
	}
}

async function ckDeaf(spt){
	if (spt.channels.get(config.fungal.vc.one).members.size > 0){
		spt.channels.get(config.fungal.vc.one).members.forEach(async function(raiders){
			await isRL(spt, 'fungal', raiders.id).then(async function(value){
				if (raiders.deaf && !warnedDeafs.includes(raiders) && !value){
					raiders.send(`You have deafened yourself in a raiding vc. If you do not undeafen yourself in the next 30 seconds, you will be suspended! If you must deafen yourself, leave the raiding vc and **leave the run** or else you will be suspended for crashing.`)
					spt.channels.get(config.fungal.rlChan).send(`${raiders} deafened himself, if they do not undeafen in the next 30 seconds, you can suspend them.`);
					warnedDeafs.push(raiders);
				}
			})
		})
	}
	if (spt.channels.get(config.fungal.vc.two).members.size > 0){
		spt.channels.get(config.fungal.vc.two).members.forEach(async function(raiders){
			await isRL(spt, 'fungal', raiders.id).then(async function(value){
				if (raiders.deaf && !warnedDeafs.includes(raiders) && !value){
					raiders.send(`You have deafened yourself in a raiding vc. If you do not undeafen yourself in the next 30 seconds, you will be suspended! If you must deafen yourself, leave the raiding vc and **leave the run** or else you will be suspended for crashing.`)
					spt.channels.get(config.fungal.rlChan).send(`${raiders} deafened himself, if they do not undeafen in the next 30 seconds, you can suspend them.`);
					warnedDeafs.push(raiders);
				}
			})
		})
	}
	if (spt.channels.get(config.fungal.vc.three).members.size > 0){
		spt.channels.get(config.fungal.vc.three).members.forEach(async function(raiders){
			await isRL(spt, 'fungal', raiders.id).then(async function(value){
				if (raiders.deaf && !warnedDeafs.includes(raiders) && !value){
					raiders.send(`You have deafened yourself in a raiding vc. If you do not undeafen yourself in the next 30 seconds, you will be suspended! If you must deafen yourself, leave the raiding vc and **leave the run** or else you will be suspended for crashing.`)
					spt.channels.get(config.fungal.rlChan).send(`${raiders} deafened himself, if they do not undeafen in the next 30 seconds, you can suspend them.`);
					warnedDeafs.push(raiders);
				}
			})
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
module.exports.afks = afks;
module.exports.updAfkObj = updAfkObj;
module.exports.ckDeaf = ckDeaf;