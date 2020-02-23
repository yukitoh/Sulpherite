const config = require("../../config.json");

async function main(spt, data, args){
	const lounge = spt.channels.get(config.fungal.vcs.lounge);

	if (args[1] == undefined){
		data.channel.send(`Invalid channel number (available: 1-5).`);
	} else {
		switch(args[1]){
			case '1':
				var raidingChannel = spt.channels.get(config.fungal.vcs.one);
				break;
			case '2':
				var raidingChannel = spt.channels.get(config.fungal.vcs.two);
				break;
			case '3':
				var raidingChannel = spt.channels.get(config.fungal.vcs.three);
				break;
			default:
				data.channel.send(`Invalid channel number (available: 1-5).`);
				break;
		}

		data.channel.send(`Clearing raiding`+args[1]+`.`)
		.then((msg)=> {
			raidingChannel.members.forEach(async function(raiders){
				await isRaidleader(spt, 'fungal', raiders.id).then(async function(value){
					if (!value) await raiders.setVoiceChannel(lounge);
				})
			})
			msg.delete();
		})
		data.channel.send(`Finished clearing raiding`+args[1]+`.`);
	}
}

module.exports = main;