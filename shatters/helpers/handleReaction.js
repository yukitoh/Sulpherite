const config = require("../../config.json");
const afkChecks = require("../commands.js").afkChecks;
const forceUpdate = require("../commands.js").updateAfkObjs;
const isRaidleader = require('../../isRL.js');
var isRLPromise = [];
var multiClassPromise = [];

async function handleReacts(spt, reaction, user){
	multiClassPromise.length = 0;
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
				await isRaidleader(spt, 'shatters', user.id).then(async function(value){
					await isRLPromise.push(value);
				})

				if (reaction.emoji.name == '❌' && isRLPromise[0]){
					// control panel react (end) -> abort
					currAfkCheckObj['aborted'] = true;
					forceUpdate(spt, false);
				} else {
					// warn for pressing x without being rl
					spt.channels.get(config.shatters.rlBotChannelID).send(`<@!${user.id}> tried to react with \`❌\`but isn't allowed to.`);
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
						await isRaidleader(spt, 'shatters', user.id).then(async function(value){
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
							} else {
								// afk check react (x) -> end
								currAfkCheckObj['ended'] = true;
								forceUpdate(spt, false);
							}
						} else {
							// warn for pressing x without being rl
							spt.channels.get(config.shatters.rlBotChannelID).send(`<@!${user.id}> tried to react with \`❌\`but isn't allowed to.`);
							// remove x reaction
								const reactX = reaction.message.reactions.get('❌');
								try {
									if (user.bot) return;
									await reactX.remove(user);
								} catch (error) {/*user reaction not found*/}
						}
						break;
					case 'shatters':
						// update raiders and move to channel if lounge
						switch (currAfkCheckObj['channelNumber']){
							case '1':
								var channelID = config.shatters.vcs.one;
								break;
							case '2':
								var channelID = config.shatters.vcs.two;
								break;
							case '3':
								var channelID = config.shatters.vcs.three;
								break;
							case '4':
								var channelID = config.shatters.vcs.four;
								break;
							case '5':
								var channelID = config.shatters.vcs.five;
								break;
						}
						if (spt.guilds.get(config.shatters.id).members.get(user.id).voiceChannel != undefined && spt.guilds.get(config.shatters.id).members.get(user.id).voiceChannel.id == config.shatters.vcs.lounge) spt.guilds.get(config.shatters.id).members.get(user.id).setVoiceChannel(channelID);
						currAfkCheckObj['raiders'] += 1;
						forceUpdate(spt, false);
						break;
					case 'shatterskey':
						if (currAfkCheckObj['key'] == 'None'){
							user.send(`You have reacted with ${spt.emojis.find(emoji => emoji.name === "shatterskey")}.\nIf you actually have a key, react with ✅ and if you made a mistake, ignore this message.`)
								.then(async function (msg){
									await msg.react('✅');
									const filter = (reaction, user) => reaction.emoji.name === '✅';
									await msg.awaitReactions(filter, { max: 2, time: 10000 })
        								.then(collected => {
           									// confirmed key
           									if (collected.get('✅').count == 2){
           										currAfkCheckObj['key'] = user;
           										forceUpdate(spt, false);
           										user.send(`The raid leader has set the location to: ${currAfkCheckObj['location']}. Please get there asap.\nYou are now our key popper. We ask that you check ${spt.channels.get(config.shatters.parse)} for raid leaders instructions.\n Please **ask** the current Raid Leader before kicking players listed in the channel.`);
           									}
        							})
								})
						} else {
							user.send(`You have reacted to ${spt.emojis.find(emoji => emoji.name === "shatterskey")}, but we already have enough keys. The raid leaders may want more than the afk check is programmed to accept. Listen to the raid leaders for further instructions.`)
						}
						break;
					case 'warrior':
						var multipleClass = multipleClasses(spt, user, 'warrior', currAfkCheckObj);
						if (multiClassPromise[0] == undefined) {
							currAfkCheckObj['warriors'].push(user);
						} else {
							var reactDelete = reaction.message.reactions.get('679186994190090270');
							try {
								if (user.bot) return;
								await reactDelete.remove(user);
							} catch (error) {/*user reaction not found*/}
							spt.channels.get(config.shatters.rlBotChannelID).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multiClassPromise[0])}).`);
						}
						break;
					case 'paladin':
						var multipleClass = multipleClasses(spt, user, 'paladin', currAfkCheckObj);
						if (multiClassPromise[0] == undefined) {
							currAfkCheckObj['paladins'].push(user);
						} else {
							var reactDelete = reaction.message.reactions.get('679187006403903509');
							try {
								if (user.bot) return;
								await reactDelete.remove(user);
							} catch (error) {/*user reaction not found*/}
							spt.channels.get(config.shatters.rlBotChannelID).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multiClassPromise[0])}).`);
						}
						break;
					case 'knight':
						var multipleClass = multipleClasses(spt, user, 'knight', currAfkCheckObj);
						console.log(multipleClass);
						if (multiClassPromise[0] == undefined) {
							currAfkCheckObj['warriors'].push(user);
						} else {
							var reactDelete = reaction.message.reactions.get('679187016071512067');
							try {
								if (user.bot) return;
								await reactDelete.remove(user);
							} catch (error) {/*user reaction not found*/}
							spt.channels.get(config.shatters.rlBotChannelID).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multiClassPromise[0])}).`);
						}
						break;
					case 'priest':
						var multipleClass = multipleClasses(spt, user, 'priest', currAfkCheckObj);
						if (multiClassPromise[0] == undefined) {
							currAfkCheckObj['warriors'].push(user);
						} else {
							var reactDelete = reaction.message.reactions.get('679187025303437312');
							try {
								if (user.bot) return;
								await reactDelete.remove(user);
							} catch (error) {/*user reaction not found*/}
							spt.channels.get(config.shatters.rlBotChannelID).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multiClassPromise[0])}).`);
						}
						break;
					case 'mystic':
						var multipleClass = multipleClasses(spt, user, 'mystic', currAfkCheckObj);
						if (multiClassPromise[0] == undefined) {
							currAfkCheckObj['warriors'].push(user);
						} else {
							var reactDelete = reaction.message.reactions.get('679187052813746186');
							try {
								if (user.bot) return;
								await reactDelete.remove(user);
							} catch (error) {/*user reaction not found*/}
							spt.channels.get(config.shatters.rlBotChannelID).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multiClassPromise[0])}).`);
						}
						break;
					case 'assassin':
						var multipleClass = multipleClasses(spt, user, 'assassin', currAfkCheckObj);
						if (multiClassPromise[0] == undefined) {
							currAfkCheckObj['assassins'].push(user);
						} else {
							var reactDelete = reaction.message.reactions.get('679187076406575107');
							try {
								if (user.bot) return;
								await reactDelete.remove(user);
							} catch (error) {/*user reaction not found*/}
							spt.channels.get(config.shatters.rlBotChannelID).send(`${user} tried to react with multiple classes (${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)}${spt.emojis.find(emoji => emoji.name === multiClassPromise[0])}).`);
						}
						break;
					case 'first':
						if (reaction.count == 3){
							// add checking if not reacting to multiple switches
							var reactDelete = reaction.message.reactions.get('679187076406575107');
							try {
								if (user.bot) return;
								await reactDelete.remove(user);
							} catch (error) {/*user reaction not found*/}
							spt.channels.get(config.shatters.rlBotChannelID).send(`${user} tried to react with ${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)} but there is already someone.`);
						}
						break;
					case 'second':
						// add checking if not reacting to multiple switches
						if (reaction.count == 3){
							var reactDelete = reaction.message.reactions.get('679187097621495820');
							try {
								if (user.bot) return;
								await reactDelete.remove(user);
							} catch (error) {/*user reaction not found*/}
							spt.channels.get(config.shatters.rlBotChannelID).send(`${user} tried to react with ${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)} but there is already someone.`);
						}
						break;
					case 'secret':
						// add checking if not reacting to multiple switches
						if (reaction.count == 3){
							var reactDelete = reaction.message.reactions.get('679187105817296934');
							try {
								if (user.bot) return;
								await reactDelete.remove(user);
							} catch (error) {/*user reaction not found*/}
							spt.channels.get(config.shatters.rlBotChannelID).send(`${user} tried to react with ${spt.emojis.find(emoji => emoji.name === reaction.emoji.name)} but there is already someone.`);
						}
						break;
					case 'nitro':
						// TODO
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
	multiClassPromise.length = 0;
	var isMultipleClass = undefined;
	switch (currentClass){
		case 'warrior':
			if (currAfkCheckObj['paladins'] != [] && currAfkCheckObj['paladins'].includes(user)) isMultipleClass = 'paladin';
			if (currAfkCheckObj['knights'] != [] && currAfkCheckObj['knights'].includes(user)) isMultipleClass = 'knight';
			if (currAfkCheckObj['priests'] != [] && currAfkCheckObj['priests'].includes(user)) isMultipleClass = 'priest';
			if (currAfkCheckObj['mystics'] != [] && currAfkCheckObj['mystics'].includes(user)) isMultipleClass = 'mystic';
			if (currAfkCheckObj['assassins'] != [] && currAfkCheckObj['assassins'].includes(user)) isMultipleClass = 'assassin';
			isMultipleClass.then(async function(value){ multiClassPromise.push(value) });
			break;
		case 'paladin':
			if (currAfkCheckObj['warriors'] != [] && currAfkCheckObj['warriors'].includes(user)) isMultipleClass = 'warrior';
			if (currAfkCheckObj['knights'] != [] && currAfkCheckObj['knights'].includes(user)) isMultipleClass = 'knight';
			if (currAfkCheckObj['priests'] != [] && currAfkCheckObj['priests'].includes(user)) isMultipleClass = 'priest';
			if (currAfkCheckObj['mystics'] != [] && currAfkCheckObj['mystics'].includes(user)) isMultipleClass = 'mystic';
			if (currAfkCheckObj['assassins'] != [] && currAfkCheckObj['assassins'].includes(user)) isMultipleClass = 'assassin';
			isMultipleClass.then(async function(value){ multiClassPromise.push(value) });
			break;
		case 'knight':
			if (currAfkCheckObj['paladins'] != [] && currAfkCheckObj['paladins'].includes(user)) isMultipleClass = 'paladin';
			if (currAfkCheckObj['warriors'] != [] && currAfkCheckObj['warriors'].includes(user)) isMultipleClass = 'warrior';
			if (currAfkCheckObj['priests'] != [] && currAfkCheckObj['priests'].includes(user)) isMultipleClass = 'priest';
			if (currAfkCheckObj['mystics'] != [] && currAfkCheckObj['mystics'].includes(user)) isMultipleClass = 'mystic';
			if (currAfkCheckObj['assassins'] != [] && currAfkCheckObj['assassins'].includes(user)) isMultipleClass = 'assassin';
			isMultipleClass.then(async function(value){ multiClassPromise.push(value) });
			break;
		case 'priest':
			if (currAfkCheckObj['paladins'] != [] && currAfkCheckObj['paladins'].includes(user)) isMultipleClass = 'paladin';
			if (currAfkCheckObj['knights'] != [] && currAfkCheckObj['knights'].includes(user)) isMultipleClass = 'knight';
			if (currAfkCheckObj['warriors'] != [] && currAfkCheckObj['warriors'].includes(user)) isMultipleClass = 'warrior';
			if (currAfkCheckObj['mystics'] != [] && currAfkCheckObj['mystics'].includes(user)) isMultipleClass = 'mystic';
			if (currAfkCheckObj['assassins'] != [] && currAfkCheckObj['assassins'].includes(user)) isMultipleClass = 'assassin';
			isMultipleClass.then(async function(value){ multiClassPromise.push(value) });
			break;
		case 'mystic':
			if (currAfkCheckObj['paladins'] != [] && currAfkCheckObj['paladins'].includes(user)) isMultipleClass = 'paladin';
			if (currAfkCheckObj['knights'] != [] && currAfkCheckObj['knights'].includes(user)) isMultipleClass = 'knight';
			if (currAfkCheckObj['priests'] != [] && currAfkCheckObj['priests'].includes(user)) isMultipleClass = 'priest';
			if (currAfkCheckObj['warriors'] != [] && currAfkCheckObj['warriors'].includes(user)) isMultipleClass = 'warrior';
			if (currAfkCheckObj['assassins'] != [] && currAfkCheckObj['assassins'].includes(user)) isMultipleClass = 'assassin';
			isMultipleClass.then(async function(value){ multiClassPromise.push(value) });
			break;
		case 'assassin':
			if (currAfkCheckObj['paladins'] != [] && currAfkCheckObj['paladins'].includes(user)) isMultipleClass = 'paladin';
			if (currAfkCheckObj['knights'] != [] && currAfkCheckObj['knights'].includes(user)) isMultipleClass = 'knight';
			if (currAfkCheckObj['priests'] != [] && currAfkCheckObj['priests'].includes(user)) isMultipleClass = 'priest';
			if (currAfkCheckObj['mystics'] != [] && currAfkCheckObj['mystics'].includes(user)) isMultipleClass = 'mystic';
			if (currAfkCheckObj['warriors'] != [] && currAfkCheckObj['warriors'].includes(user)) isMultipleClass = 'warrior';
			isMultipleClass.then(async function(value){ multiClassPromise.push(value) });
			break;
	}
}

module.exports = handleReacts;