const updateEmbedAFK = require("../helpers/updateAfkEmbed.js");
const updateControlPanel = require("../helpers/updateControlPanel.js");
const reactAFK = require("../helpers/reactAFK.js");
const unlockChannel = require("../helpers/unlockChannel.js");
const afks = require('../cmds.js').afks;
const config = require("../../config.json");

async function main(spt, data, args){
	switch(args[1]){
		case '1':
			var rdgChan = '1';
			break;
		case '2':
			var rdgChan = '2';
			break;
		case '3':
			var rdgChan = '3';
			break;
		case '4':
			var rdgChan = '4';
			break;
		case '5':
			var rdgChan = '5';
			break;
		default:
			data.channel.send(`Invalid channel number (available: 1-5).`);
			break;
	}

	switch(rdgChan){
		case '1':
			var rdgChanObj = spt.channels.get(config.shatters.vc.one);
			break;
		case '2':
			var rdgChanObj = spt.channels.get(config.shatters.vc.two);			
			break;
		case '3':
			var rdgChanObj = spt.channels.get(config.shatters.vc.three);
			break;
		case '4':
			var rdgChanObj = spt.channels.get(config.shatters.vc.four);
			break;
		case '5':
			var rdgChanObj = spt.channels.get(config.shatters.vc.five);
			break;
	}

	if (rdgChan != undefined){
		if (args[2] == "s" || args[2] == "shatters"){
			const shattersReact = spt.emojis.find(emoji => emoji.name === "shatters");
			var location = data.content.substr((args[2].length+8));
			if (location.length < 3){
				data.channel.send(`Please specify a location for raiders.`)
			} else {
				// Make afkCheck Object
				const rlChan = spt.channels.get(config.shatters.rlChan);
				const afkChan = spt.channels.get(config.shatters.afkChan);
				const afkObj = {
					host: data.author.id,
					channel: rdgChanObj.id,
					channelNumber: rdgChan,
					location: location,
					timeleft: 360,
					raiders: [],
					started: new Date(data.createdTimestamp).toISOString(),
					key: 'None',
					nitro: [],
					supremepriest: [],
					warriors: [],
					paladins: [],
					knights: [],
					priests: [],
					mystics: [],
					assassins: [],
					rushers: { first: [], second: [], secret: [] },
					postafk: false,
					afkcheck: undefined,
					controlpanel: undefined,
					ended: false,
					aborted: false
				};
				afkChan.send("@here Shatters ("+shattersReact+") started by <@!"+afkObj['host']+"> in `"+rdgChanObj.name+"`").then(async function (sent) {
					afkObj['afkcheck'] = sent.id;
					sent.edit("@here Shatters ("+shattersReact+") started by <@!"+afkObj['host']+"> in `"+rdgChanObj.name+"`", { embed: (updateEmbedAFK(spt, afkObj)) });
					await reactAFK(spt, sent);
					});	
				rlChan.send(`AFK Check control panel for `+rdgChanObj.name).then(async function (sent) {
					afkObj['controlpanel'] = sent.id;
					sent.edit({ embed: (updateControlPanel(spt, afkObj)) })
					await sent.react("❌");
				});
				// transfer this to unlock
				unlockChannel(spt, data, rdgChan, false);
				return afkObj;
			}
		} else {
			data.channel.send(`Invalid raid type, available: shatters (s).`)
			return;
		}
	} else {
		data.channel.send(`Please use an available channel.`)
	}
}
module.exports = main;