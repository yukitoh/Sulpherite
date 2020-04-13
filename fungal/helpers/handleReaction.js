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
		if (afks[x] == undefined) return;
		if (afks[x]['controlpanel'] != undefined && reaction.message.id == afks[x]['controlpanel'] || afks[x]['afkcheck'] != undefined && reaction.message.id == afks[x]['afkcheck']) currAfk = afks[x];
	}

	if (currAfk != undefined){
		switch(reaction.message.id){
			case currAfk['controlpanel']:
				// import isRL for safety
				await isRL(spt, 'fungal', user.id).then(async function(value){
					await isRLPro.push(value);
				})

				if (reaction.emoji.name == '❌' && isRLPro[0]){
					// control panel react (end) -> abort
					currAfk['aborted'] = true;
					fceUpd(spt, false);
				} else {
					// warn for pressing x without being rl
					spt.channels.get(config.fungal.rlChan).send(`<@!${user.id}> tried to react with \`❌\`but isn't allowed to.`);
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
						await isRL(spt, 'fungal', user.id).then(async function(value){
						await isRLPro.push(value);
						})

						if (isRLPro[0]){
							if (currAfk['postafk'] == false){
								// afk check react (x) -> post
								currAfk['postafk'] = true;
								currAfk['timeleft'] = 30;
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
								spt.channels.get(config.fungal.afkChan).fetchMessage(afks[x]['afkcheck'])
									.then(async function (afkmsg) {
										const reactPortal = afkmsg.reactions.get('fungal:686223695827828774');
										try {
											reactPortal.fetchUsers().then(users => {
        										for (u of users){
        											reactedPortal.push(u[0]);
        										}
        										vcRaiders.forEach(async function(vcr){
													// if rl, do not move out
													await isRL(spt, 'fungal', vcr.user.id).then(async function(isrlval){
														if (!reactedPortal.includes(vcr.user.id) && !isrlval){
															await vcr.setVoiceChannel(spt.channels.get(config.fungal.vc.afk));
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
							spt.channels.get(config.fungal.rlChan).send(`<@!${user.id}> tried to react with \`❌\`but isn't allowed to.`);
							// remove x reaction
							const reactX = reaction.message.reactions.get('❌');
							try {
								if (user.bot) return;
								await reactX.remove(user);
							} catch (error) {/*user reaction not found*/}
						}
						break;
					case 'fungal':
						// update raiders and move to channel if lnge
//						if (spt.guilds.get(config.fungal.id).members.get(user.id).voiceChannel != undefined && spt.guilds.get(config.fungal.id).members.get(user.id).voiceChannel.id == config.fungal.vc.lnge) spt.guilds.get(config.fungal.id).members.get(user.id).setVoiceChannel(afks[x]['channel']);
						currAfk['raiders'].push(user.id);
//						fceUpd(spt, false);
						break;
					case 'fungalkey':
						if (currAfk['key'] == 'None'){
							user.send(`You have reacted with ${spt.emojis.find(emoji => emoji.name === "fungalkey")}.\nIf you actually have a key, react with ✅ and if you made a mistake, ignore this message.`)
								.then(async function (msg){
									await msg.react('✅');
									const filter = (reaction, user) => reaction.emoji.name === '✅';
									await msg.awaitReactions(filter, { max: 2, time: 30000 })
        								.then(collected => {
           									// confirmed key
           									if (collected.get('✅') != undefined && collected.get('✅').count == 2){
           										currAfk['key'] = user;
           										fceUpd(spt, false);
           										user.send(`The raid leader has set the location to: ${currAfk['location']}. Please get there asap.\nYou are now our key popper. We ask that you check ${spt.channels.get(config.fungal.pmChan)} for raid leaders instructions.\n Please **ask** the current Raid Leader before kicking players listed in the channel.`);
           									}
        							})
								})
						} else {
							user.send(`You have reacted to ${spt.emojis.find(emoji => emoji.name === "fungalkey")}, but we already have enough keys. The raid leaders may want more than the afk check is programmed to accept. Listen to the raid leaders for further instructions.`);
							if (currAfk['backupkey'].length < 4){
								return currAfk['backupkey'].push(user);
							}
						}
						break;
					case 'warrior':
						currAfk['warriors'].push(user.id);
						break;
					case 'paladin':
						currAfk['paladins'].push(user.id);
						break;
					case 'knight':
						currAfk['knights'].push(user.id);
						break;
					case 'priest':
						currAfk['priests'].push(user.id);
						break;
					case 'trickster':
						currAfk['tricksters'].push(user.id);
						break;
					case 'rusher':
						if (currAfk['rusher'] == 'None'){
							user.send(`You have reacted with ${spt.emojis.find(emoji => emoji.name === "rusher")}.\nIf you actually have the intention to rush, react with ✅ and if you made a mistake, ignore this message.`)
								.then(async function (msg){
									await msg.react('✅');
									const filter = (reaction, user) => reaction.emoji.name === '✅';
									await msg.awaitReactions(filter, { max: 2, time: 10000 })
        								.then(collected => {
           									// confirmed key
           									if (collected.get('✅').count == 2){
           										if(spt.guilds.get(config.fungal.id).members.get(user.id).roles.find(x => x.name === config.fungal.rshRole)) {
           											currAfk['rusher'] = user;
           											fceUpd(spt, false);
           											user.send(`The raid leader has set the location to: ${currAfk['location']}.`);
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
						if(spt.guilds.get(config.fungal.id).members.get(user.id).roles.find(x => x.name === config.fungal.ntrRole) || spt.guilds.get(config.fungal.id).members.get(user.id).roles.find(x => x.name === config.fungal.donRole)) {
							if (currAfk['nitro'].length > 9){
								return data.channel.send(`Sorry but the limit to nitro reacts have been set to 10!`);
							}
							currAfk['nitro'].push(user);
							user.send(`As a nitro booster, you have access to location: ${currAfk['location']}.`);
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

module.exports = handleReacts;