const config = require("../../config.json");
const isEventRaidleader = require('../../isERL.js');

async function main(spt, data, args){
	const lounge = spt.channels.get(config.fungal.event.lounge);

	if (args[1] == undefined){
		data.channel.send(`Invalid channel number (available: 1-4).`);
	} else {
		switch(args[1]){
			case '1':
				var raidingChannel = spt.channels.get(config.fungal.event.one);
				break;
			case '2':
				var raidingChannel = spt.channels.get(config.fungal.event.two);
				break;
			case '3':
				var raidingChannel = spt.channels.get(config.fungal.event.three);
				break;
			case '4':
				var raidingChannel = spt.channels.get(config.fungal.event.four);
				break;
			default:
				data.channel.send(`Invalid channel number (available: 1-4).`);
				break;
		}

		data.channel.send(`Clearing event `+args[1]+`.`)
		.then((msg)=> {
			raidingChannel.members.forEach(async function(raiders){
				await isEventRaidleader(spt, 'fungal', raiders.id).then(async function(value){
					if (!value) await raiders.setVoiceChannel(lounge);
				}
			})
			msg.delete();
		})
		data.channel.send(`Finished clearing event `+args[1]+`.`);
	}
}

module.exports = main;