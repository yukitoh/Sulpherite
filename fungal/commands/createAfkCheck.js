const updateEmbedAFK = require("../helpers/updateAfkEmbed.js");
const updateControlPanel = require("../helpers/updateControlPanel.js");
const reactAFK = require("../helpers/reactAFK.js");
const unlockChannel = require("../helpers/unlockChannel.js");
const afkChecks = require('../commands.js').afkChecks;
const config = require("../../config.json");

async function main(spt, data, args){
	switch(args[1]){
		case '1':
			var raidingChannel = '1';
			break;
		case '2':
			var raidingChannel = '2';
			break;
		case '3':
			var raidingChannel = '3';
			break;
		case '4':
			var raidingChannel = '4';
			break;
		case '5':
			var raidingChannel = '5';
			break;
		default:
			data.channel.send(`Invalid channel number (available: 1-5).`);
			break;
	}

	switch(raidingChannel){
		case '1':
			var raidingChannelObj = spt.channels.get(config.fungal.vcs.one);
			break;
		case '2':
			var raidingChannelObj = spt.channels.get(config.fungal.vcs.two);			
			break;
		case '3':
			var raidingChannelObj = spt.channels.get(config.fungal.vcs.three);
			break;
		case '4':
			var raidingChannelObj = spt.channels.get(config.fungal.vcs.four);
			break;
		case '5':
			var raidingChannelObj = spt.channels.get(config.fungal.vcs.five);
			break;
	}

	if (raidingChannel != undefined){
		if (args[2] == "fc" || args[2] == "fungal"){
			const fungalReact = spt.emojis.find(emoji => emoji.name === "fungal");
			var location = data.content.substr((args[2].length+8));
			if (location.length < 3){
				data.channel.send(`Please specify a location for raiders.`)
			} else {
				// Make afkCheck Object
				const commandsChannel = spt.channels.get(config.fungal.rlBotChannelID);
				const afkCheckChannel = spt.channels.get(config.fungal.afkcheckID);
				const afkCheckObj = {
					host: data.author.id,
					channel: raidingChannelObj.id,
					channelNumber: raidingChannel,
					location: location,
					timeleft: 360,
					raiders: 0,
					started: new Date(data.createdTimestamp).toISOString(),
					key: 'None',
					nitro: [],
					rusher: 'None',
					warriors: [],
					paladins: [],
					knights: [],
					priests: [],
					tricksters: [],
					postafk: false,
					afkcheck: undefined,
					controlpanel: undefined,
					ended: false,
					aborted: false
				};
				afkCheckChannel.send("@here Fungal Cavern ("+fungalReact+") started by <@!"+afkCheckObj['host']+"> in `"+raidingChannelObj.name+"`").then(async function (sent) {
					afkCheckObj['afkcheck'] = sent.id;
					sent.edit("@here Fungal Cavern ("+fungalReact+") started by <@!"+afkCheckObj['host']+"> in `"+raidingChannelObj.name+"`", { embed: (updateEmbedAFK(spt, afkCheckObj)) });
					await reactAFK(spt, sent);
					});	
				commandsChannel.send(`AFK Check control panel for `+raidingChannelObj.name).then(async function (sent) {
					afkCheckObj['controlpanel'] = sent.id;
					sent.edit({ embed: (updateControlPanel(spt, afkCheckObj)) })
					await sent.react("❌");
				});
				// transfer this to unlock
				unlockChannel(spt, data, raidingChannel, false);
				return afkCheckObj;
			}
		} else {
			data.channel.send(`Invalid raid type, available: fungal (fc).`)
			return;
		}
	} else {
		data.channel.send(`Please use an available channel.`)
	}
}
module.exports = main;