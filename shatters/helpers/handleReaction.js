const config = require("../../config.json");
const afks = require("../cmds.js").afks;
const fceUpd = require("../cmds.js").updAfkObj;
const isRL = require('../../isRL.js');
var isRLPro = [];

async function handleReacts(spt, reaction, user){
	isRLPro.length = 0;
	// locate afk check
	var currAfk;
	for (x in afks) {
		if (afks[x]['controlpanel'] != undefined && reaction.message.id == afks[x]['controlpanel'] || afks[x]['afkcheck'] != undefined && reaction.message.id == afks[x]['afkcheck']) currAfk = afks[x];
	}

	if (currAfk != undefined){
		switch(reaction.message.id){
			case currAfk['controlpanel']:
				// import isRL for safety
				await isRL(spt, 'shatters', user.id).then(async function(value){
					await isRLPro.push(value);
				})

				if (reaction.emoji.name == '❌' && isRLPro[0]){
					// control panel react (end) -> abort
					currAfk['aborted'] = true;
					fceUpd(spt, false);
				} else {
					// warn for pressing x without being rl
					spt.channels.get(config.shatters.rlChan).send(`<@!${user.id}> tried to react with \`❌\`but isn't allowed to.`);
					// remove x reaction
						const reactX = reaction.message.reactions.get('❌');
						try {
							if (user.bot) return;
							await reactX.remove(user);
						} catch (error) {/*user reaction not found*/}
				}
				break;
			case currAfk['afkcheck']:
				// afk check react
				switch (reaction.emoji.name){
					case '❌':
						// import isRL for safety
						await isRL(spt, 'shatters', user.id).then(async function(value){
						await isRLPro.push(value);
						})

						if (isRLPro[0]){
							if (currAfk['postafk'] == false){
								// afk check react (x) -> post
								currAfk['postafk'] = true;
								currAfk['timeleft'] = 30;
								// lock channel & force update
								await spt.channels.get(afks[x]['channel']).setName(`raiding`+afks[x]['channelNumber']);
								await spt.channels.get(afks[x]['channel']).overwritePermissions(spt.guilds.get(config.shatters.id).roles.find(role => role.name == config.shatters.rdrRole), { 'CONNECT': false, 'SPEAK': false });
								fceUpd(spt, false);
								// remove x reaction
								const reactX = reaction.message.reactions.get('❌');
								try {
									if (user.bot) return;
									await reactX.remove(user);
								} catch (error) {/*user reaction not found*/}
								// move to lnge people who didn't react with portal
								var vcRaiders = [];
								var reactedPortal = [];
								spt.channels.get(afks[x]['channel']).members.forEach(async function(raiders){
									await vcRaiders.push(raiders);
								})
								spt.channels.get(config.shatters.afkChan).fetchMessage(afks[x]['afkcheck'])
									.then(async function (afkmsg) {
										const reactPortal = afkmsg.reactions.get('shatters:679186863264628736');
										try {
											reactPortal.fetchUsers().then(users => {
        										for (u of users){
        											reactedPortal.push(u[0]);
        										}
        										vcRaiders.forEach(async function(vcr){
													// if rl, do not move out
													await isRL(spt, 'shatters', vcr.user.id).then(async function(isrlval){
														if (!reactedPortal.includes(vcr.user.id) && !isrlval){
															await vcr.setVoiceChannel(spt.channels.get(config.shatters.vc.afk));
														}
													})
												})
											});
										} catch (error) {/*no users reaction left*/}
									})
								//
							} else {
								// afk check react (x) -> end
								currAfk['ended'] = true;
								fceUpd(spt, false);
							}
						} else {
							// warn for pressing x without being rl
							spt.channels.get(config.shatters.rlChan).send(`<@!${user.id}> tried to react with \`❌\`but isn't allowed to.`);
							// remove x reaction
								const reactX = reaction.message.reactions.get('❌');
								try {
									if (user.bot) return;
									await reactX.remove(user);
								} catch (error) {/*user reaction not found*/}
						}
						break;
					case 'shatters':
						// update raiders and move to channel if lnge
						switch (currAfk['channelNumber']){
							case '1':
								var channelID = config.shatters.vc.one;
								break;
							case '2':
								var channelID = config.shatters.vc.two;
								break;
							case '3':
								var channelID = config.shatters.vc.three;
								break;
							case '4':
								var channelID = config.shatters.vc.four;
								break;
							case '5':
								var channelID = config.shatters.vc.five;
								break;
						}
						if (spt.guilds.get(config.shatters.id).members.get(user.id).voiceChannel != undefined && spt.guilds.get(config.shatters.id).members.get(user.id).voiceChannel.id == config.shatters.vc.lnge) spt.guilds.get(config.shatters.id).members.get(user.id).setVoiceChannel(channelID);
						currAfk['raiders'].push(user.id);
						fceUpd(spt, false);
						break;
					case 'shatterskey':
						if (currAfk['key'] == 'None'){
							user.send(`You have reacted with ${spt.emojis.find(emoji => emoji.name === "shatterskey")}.\nIf you actually have a key, react with ✅ and if you made a mistake, ignore this message.`)
								.then(async function (msg){
									await msg.react('✅');
									const filter = (reaction, user) => reaction.emoji.name === '✅';
									await msg.awaitReactions(filter, { max: 2, time: 30000 })
        								.then(collected => {
           									// confirmed key
           									if (collected.get('✅') != undefined && collected.get('✅').count == 2){
           										currAfk['key'] = user;
           										fceUpd(spt, false);
           										user.send(`The raid leader has set the location to: ${currAfk['location']}. Please get there asap.\nYou are now our key popper. We ask that you check ${spt.channels.get(config.shatters.pmChan)} for raid leaders instructions.\n Please **ask** the current Raid Leader before kicking players listed in the channel.`);
           									}
        							})
								})
						} else {
							user.send(`You have reacted to ${spt.emojis.find(emoji => emoji.name === "shatterskey")}, but we already have enough keys. The raid leaders may want more than the afk check is programmed to accept. Listen to the raid leaders for further instructions.`)
						}
						break;
					case 'warrior':
						multipleClasses(spt, user, 'warrior', currAfk)
						.then(async function(multipleClass){
							if (multipleClass == undefined) {
								currAfk['warriors'].push(user);
							} else {
								try {
									if (user.bot) return;
									reaction.remove(user);
								} catch (error) {/*user reaction not found*/}
								spt.channels.get(config.shatters.rlChan).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multipleClass)}).`);
								user.send(`stop reacting with multiple classes buddy`);
							}
						})
						break;
					case 'paladin':
						multipleClasses(spt, user, 'paladin', currAfk)
						.then(async function(multipleClass){
							if (multipleClass == undefined) {
								currAfk['paladins'].push(user);
							} else {
								try {
									if (user.bot) return;
									reaction.remove(user);
								} catch (error) {/*user reaction not found*/}
								spt.channels.get(config.shatters.rlChan).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multipleClass)}).`);
								user.send(`stop reacting with multiple classes buddy`);
							}
						})
						break;
					case 'knight':
						multipleClasses(spt, user, 'knight', currAfk)
						.then(async function(multipleClass){
							if (multipleClass == undefined) {
								currAfk['knights'].push(user);
							} else {
								try {
									if (user.bot) return;
									reaction.remove(user);
								} catch (error) {/*user reaction not found*/}
								spt.channels.get(config.shatters.rlChan).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multipleClass)}).`);
								user.send(`stop reacting with multiple classes buddy`);
							}
						})
						break;
					case 'priest':
						multipleClasses(spt, user, 'priest', currAfk)
						.then(async function(multipleClass){
							if (multipleClass == undefined) {
								currAfk['priests'].push(user);
							} else {
								try {
									if (user.bot) return;
									reaction.remove(user);
								} catch (error) {/*user reaction not found*/}
								spt.channels.get(config.shatters.rlChan).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multipleClass)}).`);
								user.send(`stop reacting with multiple classes buddy`);
							}
						})
						if(spt.guilds.get(config.shatters.id).members.get(user.id).roles.find(x => x.name === config.shatters.sppRole)) {
							currAfk['supremepriest'].push(user);
							fceUpd(spt, false);
						}
						break;
					case 'mystic':
						multipleClasses(spt, user, 'mystic', currAfk)
						.then(async function(multipleClass){
							if (multipleClass == undefined) {
								currAfk['mystics'].push(user);
							} else {
								try {
									if (user.bot) return;
									reaction.remove(user);
								} catch (error) {/*user reaction not found*/}
								spt.channels.get(config.shatters.rlChan).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multipleClass)}).`);
								user.send(`stop reacting with multiple classes buddy`);
							}
						})
						break;
					case 'assassin':
						multipleClasses(spt, user, 'assassin', currAfk)
						.then(async function(multipleClass){
							if (multipleClass == undefined) {
								currAfk['assassins'].push(user);
							} else {
								try {
									if (user.bot) return;
									reaction.remove(user);
								} catch (error) {/*user reaction not found*/}
								spt.channels.get(config.shatters.rlChan).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multipleClass)}).`);
								user.send(`stop reacting with multiple classes buddy`);
							}
						})
						break;
					case 'first':
						if (reaction.count == 3){
							try {
								if (user.bot) return;
								reaction.remove(user);
							} catch (error) {/*user reaction not found*/}
							spt.channels.get(config.shatters.rlChan).send(`${user} tried to react with ${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)} but there is already someone.`);
							user.send(`Sorry there's already someone on this switch buddy`);
						} else {
							if (currAfk['rushers']['second'] != [] && currAfk['rushers']['second'].includes(user.id) || currAfk['rushers']['secret'] != [] && currAfk['rushers']['secret'].includes(user.id)){
								try {
									if (user.bot) return;
									reaction.remove(user);
								} catch (error) {/*user reaction not found*/}
								user.send(`You can't react with more than one switch at a time. However, if no other rusher shows up, you can ask to Raid Leader to rush multiple switches.`);
							} else if (!currAfk['rushers']['second'].includes(user.id) && !currAfk['rushers']['secret'].includes(user.id)) {
								await currAfk['rushers']['first'].push(user.id);
							}
						}
						break;
					case 'second':
						if (reaction.count == 3){
							try {
								if (user.bot) return;
								reaction.remove(user);
							} catch (error) {/*user reaction not found*/}
							spt.channels.get(config.shatters.rlChan).send(`${user} tried to react with ${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)} but there is already someone.`);
							user.send(`Sorry there's already someone on this switch buddy`);
						} else {
							if (currAfk['rushers']['first'] != [] && currAfk['rushers']['first'].includes(user.id) || currAfk['rushers']['secret'] != [] && currAfk['rushers']['secret'].includes(user.id)){
								try {
									if (user.bot) return;
									reaction.remove(user);
								} catch (error) {/*user reaction not found*/}
								user.send(`You can't react with more than one switch at a time. However, if no other rusher shows up, you can ask to Raid Leader to rush multiple switches.`);
							} else if (!currAfk['rushers']['first'].includes(user.id) && !currAfk['rushers']['secret'].includes(user.id)) {
								await currAfk['rushers']['second'].push(user.id);
							}
						}
						break;
					case 'secret':
						if (reaction.count == 3){
							try {
								if (user.bot) return;
								reaction.remove(user);
							} catch (error) {/*user reaction not found*/}
							spt.channels.get(config.shatters.rlChan).send(`${user} tried to react with ${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)} but there is already someone.`);
							user.send(`Sorry there's already someone on this switch buddy`);
						} else {
							if (currAfk['rushers']['first'] != [] && currAfk['rushers']['first'].includes(user.id) || currAfk['rushers']['second'] != [] && currAfk['rushers']['second'].includes(user.id)){
								try {
									if (user.bot) return;
									reaction.remove(user);
								} catch (error) {/*user reaction not found*/}
								user.send(`You can't react with more than one switch at a time. However, if no other rusher shows up, you can ask to Raid Leader to rush multiple switches.`);
							} else if (!currAfk['rushers']['first'].includes(user.id) && !currAfk['rushers']['second'].includes(user.id)) {
								await currAfk['rushers']['secret'].push(user.id);
							}
						}
						break;
					case 'nitro':
						if(spt.guilds.get(config.shatters.id).members.get(user.id).roles.find(x => x.name === config.shatters.ntrRole)) {
							currAfk['nitro'].push(user);
							user.send(`As a nitro booster, you have access to location: ${currAfk['location']}.`);
						}
						break;
					default:
						// wrong reaction, skip
						break;
				}
				break;
		}
	}
}

async function multipleClasses(spt, user, currentClass, currAfk){
	var isMultipleClass = undefined;
	switch (currentClass){
		case 'warrior':
			if (currAfk['paladins'] != [] && currAfk['paladins'].includes(user)) isMultipleClass = 'paladin';
			if (currAfk['knights'] != [] && currAfk['knights'].includes(user)) isMultipleClass = 'knight';
			if (currAfk['priests'] != [] && currAfk['priests'].includes(user)) isMultipleClass = 'priest';
			if (currAfk['mystics'] != [] && currAfk['mystics'].includes(user)) isMultipleClass = 'mystic';
			if (currAfk['assassins'] != [] && currAfk['assassins'].includes(user)) isMultipleClass = 'assassin';
			return Promise.resolve(isMultipleClass);
			break;
		case 'paladin':
			if (currAfk['warriors'] != [] && currAfk['warriors'].includes(user)) isMultipleClass = 'warrior';
			if (currAfk['knights'] != [] && currAfk['knights'].includes(user)) isMultipleClass = 'knight';
			if (currAfk['priests'] != [] && currAfk['priests'].includes(user)) isMultipleClass = 'priest';
			if (currAfk['mystics'] != [] && currAfk['mystics'].includes(user)) isMultipleClass = 'mystic';
			if (currAfk['assassins'] != [] && currAfk['assassins'].includes(user)) isMultipleClass = 'assassin';
			return Promise.resolve(isMultipleClass);
			break;
		case 'knight':
			if (currAfk['paladins'] != [] && currAfk['paladins'].includes(user)) isMultipleClass = 'paladin';
			if (currAfk['warriors'] != [] && currAfk['warriors'].includes(user)) isMultipleClass = 'warrior';
			if (currAfk['priests'] != [] && currAfk['priests'].includes(user)) isMultipleClass = 'priest';
			if (currAfk['mystics'] != [] && currAfk['mystics'].includes(user)) isMultipleClass = 'mystic';
			if (currAfk['assassins'] != [] && currAfk['assassins'].includes(user)) isMultipleClass = 'assassin';
			return Promise.resolve(isMultipleClass);
			break;
		case 'priest':
			if (currAfk['paladins'] != [] && currAfk['paladins'].includes(user)) isMultipleClass = 'paladin';
			if (currAfk['knights'] != [] && currAfk['knights'].includes(user)) isMultipleClass = 'knight';
			if (currAfk['warriors'] != [] && currAfk['warriors'].includes(user)) isMultipleClass = 'warrior';
			if (currAfk['mystics'] != [] && currAfk['mystics'].includes(user)) isMultipleClass = 'mystic';
			if (currAfk['assassins'] != [] && currAfk['assassins'].includes(user)) isMultipleClass = 'assassin';
			return Promise.resolve(isMultipleClass);
			break;
		case 'mystic':
			if (currAfk['paladins'] != [] && currAfk['paladins'].includes(user)) isMultipleClass = 'paladin';
			if (currAfk['knights'] != [] && currAfk['knights'].includes(user)) isMultipleClass = 'knight';
			if (currAfk['priests'] != [] && currAfk['priests'].includes(user)) isMultipleClass = 'priest';
			if (currAfk['warriors'] != [] && currAfk['warriors'].includes(user)) isMultipleClass = 'warrior';
			if (currAfk['assassins'] != [] && currAfk['assassins'].includes(user)) isMultipleClass = 'assassin';
			return Promise.resolve(isMultipleClass);
			break;
		case 'assassin':
			if (currAfk['paladins'] != [] && currAfk['paladins'].includes(user)) isMultipleClass = 'paladin';
			if (currAfk['knights'] != [] && currAfk['knights'].includes(user)) isMultipleClass = 'knight';
			if (currAfk['priests'] != [] && currAfk['priests'].includes(user)) isMultipleClass = 'priest';
			if (currAfk['mystics'] != [] && currAfk['mystics'].includes(user)) isMultipleClass = 'mystic';
			if (currAfk['warriors'] != [] && currAfk['warriors'].includes(user)) isMultipleClass = 'warrior';
			return Promise.resolve(isMultipleClass);
			break;
	}
}

module.exports = handleReacts;