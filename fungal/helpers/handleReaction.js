const config = require("../../config.json");
const afkChecks = require("../commands.js").afkChecks;
const forceUpdate = require("../commands.js").updateAfkObjs;
const isRaidleader = require('../../isRL.js');
var isRLPromise = [];

async function handleReacts(spt, reaction, user){
	isRLPromise.length = 0;
	// locate afk check
	var currAfkCheckObj;
	for (x in afkChecks) {
		if (reaction.message.id == afkChecks[x]['controlpanel'] || reaction.message.id == afkChecks[x]['afkcheck']) currAfkCheckObj = afkChecks[x];
	}

	if (currAfkCheckObj != undefined){
		switch(reaction.message.id){
			case currAfkCheckObj['controlpanel']:
				// import isRL for safety
				await isRaidleader(spt, 'fungal', user.id).then(async function(value){
					await isRLPromise.push(value);
				})

				if (reaction.emoji.name == '❌' && isRLPromise[0]){
					// control panel react (end) -> abort
					currAfkCheckObj['aborted'] = true;
					forceUpdate(spt, false);
				} else {
					// warn for pressing x without being rl
					spt.channels.get(config.fungal.rlBotChannelID).send(`<@!${user.id}> tried to react with \`❌\`but isn't allowed to.`);
					// remove x reaction
						const reactX = reaction.message.reactions.get('❌');
						try {
							if (user.bot) return;
							await reactX.remove(user);
						} catch (error) {/*user reaction not found*/}
				}
				break;
			case currAfkCheckObj['afkcheck']:
				// afk check react
				switch (reaction.emoji.name){
					case '❌':
						// import isRL for safety
						await isRaidleader(spt, 'fungal', user.id).then(async function(value){
						await isRLPromise.push(value);
						})

						if (isRLPromise[0]){
							if (currAfkCheckObj['postafk'] == false){
								// afk check react (x) -> post
								currAfkCheckObj['postafk'] = true;
								currAfkCheckObj['timeleft'] = 30;
								forceUpdate(spt, false);
								// remove x reaction
								const reactX = reaction.message.reactions.get('❌');
								try {
									if (user.bot) return;
									await reactX.remove(user);
								} catch (error) {/*user reaction not found*/}
								// move to lounge people who didn't react with portal
								var vcRaiders = [];
								var reactedPortal = [];
								spt.channels.get(afkChecks[x]['channel']).members.forEach(async function(raiders){
									await vcRaiders.push(raiders);
								})
								spt.channels.get(config.fungal.afkcheckID).fetchMessage(afkChecks[x]['afkcheck'])
									.then(async function (afkmsg) {
										const reactPortal = afkmsg.reactions.get('fungal:680172932382720007');
										try {
											for (const user of reactPortal.users.values()) {
												reactedPortal.push(user.id);
											}
										} catch (error) {/*no users reaction left*/}
										vcRaiders.forEach(async function(vcr){
											// if rl, do not move out
											await isRaidleader(spt, 'fungal', vcr.user.id).then(async function(value){
												await isRLPromise.push(value);
											})
											if (!reactedPortal.includes(vcr.user.id) && !isRLPromise[0]){
												await vcr.setVoiceChannel(spt.channels.get(config.fungal.vcs.lounge));
											}
										})
									})
							} else {
								// afk check react (x) -> end
								currAfkCheckObj['ended'] = true;
								forceUpdate(spt, false);
							}
						} else {
							// warn for pressing x without being rl
							spt.channels.get(config.fungal.rlBotChannelID).send(`<@!${user.id}> tried to react with \`❌\`but isn't allowed to.`);
							// remove x reaction
							const reactX = reaction.message.reactions.get('❌');
							try {
								if (user.bot) return;
								await reactX.remove(user);
							} catch (error) {/*user reaction not found*/}
						}
						break;
					case 'fungal':
						// update raiders and move to channel if lounge
						switch (currAfkCheckObj['channelNumber']){
							case '1':
								var channelID = config.fungal.vcs.one;
								break;
							case '2':
								var channelID = config.fungal.vcs.two;
								break;
							case '3':
								var channelID = config.fungal.vcs.three;
								break;
							case '4':
								var channelID = config.fungal.vcs.four;
								break;
							case '5':
								var channelID = config.fungal.vcs.five;
								break;
						}
						if (spt.guilds.get(config.fungal.id).members.get(user.id).voiceChannel != undefined && spt.guilds.get(config.fungal.id).members.get(user.id).voiceChannel.id == config.fungal.vcs.lounge) spt.guilds.get(config.fungal.id).members.get(user.id).setVoiceChannel(channelID);
						currAfkCheckObj['raiders'].push(user.id);
						forceUpdate(spt, false);
						break;
					case 'fungalkey':
						if (currAfkCheckObj['key'] == 'None'){
							user.send(`You have reacted with ${spt.emojis.find(emoji => emoji.name === "fungalkey")}.\nIf you actually have a key, react with ✅ and if you made a mistake, ignore this message.`)
								.then(async function (msg){
									await msg.react('✅');
									const filter = (reaction, user) => reaction.emoji.name === '✅';
									await msg.awaitReactions(filter, { max: 2, time: 10000 })
        								.then(collected => {
           									// confirmed key
           									if (collected.get('✅').count == 2){
           										currAfkCheckObj['key'] = user;
           										forceUpdate(spt, false);
           										user.send(`The raid leader has set the location to: ${currAfkCheckObj['location']}. Please get there asap.\nYou are now our key popper. We ask that you check ${spt.channels.get(config.fungal.parse)} for raid leaders instructions.\n Please **ask** the current Raid Leader before kicking players listed in the channel.`);
           									}
        							})
								})
						} else {
							user.send(`You have reacted to ${spt.emojis.find(emoji => emoji.name === "fungalkey")}, but we already have enough keys. The raid leaders may want more than the afk check is programmed to accept. Listen to the raid leaders for further instructions.`)
						}
						break;
					case 'warrior':
						var multipleClass = multipleClasses(spt, user, 'warrior', currAfkCheckObj)
						.then(async function(multipleClass){
							if (multipleClass == undefined) {
								currAfkCheckObj['warriors'].push(user);
							} else {
								try {
									if (user.bot) return;
									reaction.remove(user);
								} catch (error) {/*user reaction not found*/}
								spt.channels.get(config.fungal.rlBotChannelID).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multipleClass)}).`);
							}
						})
						break;
					case 'paladin':
						var multipleClass = multipleClasses(spt, user, 'paladin', currAfkCheckObj)
						.then(async function(multipleClass){
							if (multipleClass == undefined) {
								currAfkCheckObj['paladins'].push(user);
							} else {
								try {
									if (user.bot) return;
									reaction.remove(user);
								} catch (error) {/*user reaction not found*/}
								spt.channels.get(config.fungal.rlBotChannelID).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multipleClass)}).`);
							}
						})
						break;
					case 'knight':
						var multipleClass = multipleClasses(spt, user, 'knight', currAfkCheckObj)
						.then(async function(multipleClass){
							if (multipleClass == undefined) {
								currAfkCheckObj['knights'].push(user);
							} else {
								try {
									if (user.bot) return;
									reaction.remove(user);
								} catch (error) {/*user reaction not found*/}
								spt.channels.get(config.fungal.rlBotChannelID).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multipleClass)}).`);
							}
						})
						break;
					case 'priest':
						var multipleClass = multipleClasses(spt, user, 'priest', currAfkCheckObj)
						.then(async function(multipleClass){
							if (multipleClass == undefined) {
								currAfkCheckObj['priests'].push(user);
							} else {
								try {
									if (user.bot) return;
									reaction.remove(user);
								} catch (error) {/*user reaction not found*/}
								spt.channels.get(config.fungal.rlBotChannelID).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multipleClass)}).`);
							}
						})
						break;
					case 'trickster':
						var multipleClass = multipleClasses(spt, user, 'trickster', currAfkCheckObj)
						.then(async function(multipleClass){
							if (multipleClass == undefined) {
								currAfkCheckObj['tricksters'].push(user);
							} else {
								try {
									if (user.bot) return;
									reaction.remove(user);
								} catch (error) {/*user reaction not found*/}
								spt.channels.get(config.fungal.rlBotChannelID).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multipleClass)}).`);
							}
						})
						break;
					case 'rusher':
						if (currAfkCheckObj['rusher'] == 'None'){
							user.send(`You have reacted with ${spt.emojis.find(emoji => emoji.name === "rusher")}.\nIf you actually have the intention to rush, react with ✅ and if you made a mistake, ignore this message.`)
								.then(async function (msg){
									await msg.react('✅');
									const filter = (reaction, user) => reaction.emoji.name === '✅';
									await msg.awaitReactions(filter, { max: 2, time: 10000 })
        								.then(collected => {
           									// confirmed key
           									if (collected.get('✅').count == 2){
           										if(spt.guilds.get(config.fungal.id).members.get(user.id).roles.find(x => x.name === config.fungal.rusherRole)) {
           											currAfkCheckObj['rusher'] = user;
           											forceUpdate(spt, false);
           											user.send(`The raid leader has set the location to: ${currAfkCheckObj['location']}.`);
           										} else {
           											user.send(`Sorry you are not an official rusher.`)
           											try {
														if (user.bot) return;
														reaction.remove(user);
													} catch (error) {/*user reaction not found*/}
           										}
           									}
        							})
								})
						} else {
							user.send(`You have reacted to ${spt.emojis.find(emoji => emoji.name === "rusher")}, but we already have enough rushers. The raid leaders may want more than the afk check is programmed to accept. Listen to the raid leaders for further instructions.`)
						}
						break;
					case 'nitro':
						if(spt.guilds.get(config.fungal.id).members.get(user.id).roles.find(x => x.name === config.fungal.nitroRole)) {
							currAfkCheckObj['nitro'].push(user);
							user.send(`As a nitro booster, you have access to location: ${currAfkCheckObj['location']}.`);
						} else {
							try {
								if (user.bot) return;
								reaction.remove(user);
							} catch (error) {/*user reaction not found*/}
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

async function multipleClasses(spt, user, currentClass, currAfkCheckObj){
	var isMultipleClass = undefined;
	switch (currentClass){
		case 'warrior':
			if (currAfkCheckObj['paladins'] != [] && currAfkCheckObj['paladins'].includes(user)) isMultipleClass = 'paladin';
			if (currAfkCheckObj['knights'] != [] && currAfkCheckObj['knights'].includes(user)) isMultipleClass = 'knight';
			if (currAfkCheckObj['priests'] != [] && currAfkCheckObj['priests'].includes(user)) isMultipleClass = 'priest';
			if (currAfkCheckObj['tricksters'] != [] && currAfkCheckObj['tricksters'].includes(user)) isMultipleClass = 'trickster';
			return Promise.resolve(isMultipleClass);
			break;
		case 'paladin':
			if (currAfkCheckObj['warriors'] != [] && currAfkCheckObj['warriors'].includes(user)) isMultipleClass = 'warrior';
			if (currAfkCheckObj['knights'] != [] && currAfkCheckObj['knights'].includes(user)) isMultipleClass = 'knight';
			if (currAfkCheckObj['priests'] != [] && currAfkCheckObj['priests'].includes(user)) isMultipleClass = 'priest';
			if (currAfkCheckObj['tricksters'] != [] && currAfkCheckObj['tricksters'].includes(user)) isMultipleClass = 'trickster';
			return Promise.resolve(isMultipleClass);
			break;
		case 'knight':
			if (currAfkCheckObj['paladins'] != [] && currAfkCheckObj['paladins'].includes(user)) isMultipleClass = 'paladin';
			if (currAfkCheckObj['warriors'] != [] && currAfkCheckObj['warriors'].includes(user)) isMultipleClass = 'warrior';
			if (currAfkCheckObj['priests'] != [] && currAfkCheckObj['priests'].includes(user)) isMultipleClass = 'priest';
			if (currAfkCheckObj['tricksters'] != [] && currAfkCheckObj['tricksters'].includes(user)) isMultipleClass = 'trickster';
			return Promise.resolve(isMultipleClass);
			break;
		case 'priest':
			if (currAfkCheckObj['paladins'] != [] && currAfkCheckObj['paladins'].includes(user)) isMultipleClass = 'paladin';
			if (currAfkCheckObj['knights'] != [] && currAfkCheckObj['knights'].includes(user)) isMultipleClass = 'knight';
			if (currAfkCheckObj['warriors'] != [] && currAfkCheckObj['warriors'].includes(user)) isMultipleClass = 'warrior';
			if (currAfkCheckObj['tricksters'] != [] && currAfkCheckObj['tricksters'].includes(user)) isMultipleClass = 'trickster';
			return Promise.resolve(isMultipleClass);
			break;
		case 'trickster':
			if (currAfkCheckObj['paladins'] != [] && currAfkCheckObj['paladins'].includes(user)) isMultipleClass = 'paladin';
			if (currAfkCheckObj['knights'] != [] && currAfkCheckObj['knights'].includes(user)) isMultipleClass = 'knight';
			if (currAfkCheckObj['priests'] != [] && currAfkCheckObj['priests'].includes(user)) isMultipleClass = 'priest';
			if (currAfkCheckObj['warriors'] != [] && currAfkCheckObj['warriors'].includes(user)) isMultipleClass = 'warrior';
			return Promise.resolve(isMultipleClass);
			break;
	}
}

module.exports = handleReacts;