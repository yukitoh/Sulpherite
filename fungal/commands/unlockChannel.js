const config = require("../../config.json");

async function main(spt, data, args, log){
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
			case '4':
				var raidingChannel = spt.channels.get(config.fungal.vcs.four);
				break;
			case '5':
				var raidingChannel = spt.channels.get(config.fungal.vcs.four);
				break;
			default:
				data.channel.send(`Invalid channel number (available: 1-5).`);
				break;
		}
		
		if (raidingChannel != undefined){
			raidingChannel.setName(`raiding`+args[1]+` <-- Join!`);
			// Allow permissions for "Raider" role to join
			if (log) data.channel.send(`Unlocked raiding`+args[1]+`.`);
		}
	}
}

module.exports = main;