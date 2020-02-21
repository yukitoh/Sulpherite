const config = require("../../config.json");

async function main(spt, data, raiding, log){
	if (raiding == undefined){
		data.channel.send(`Invalid channel number (available: 1-5).`);
	} else {
		switch(raiding){
			case '1':
				var raidingChannel = spt.channels.get(config.shatters.vcs.one);
				break;
			case '2':
				var raidingChannel = spt.channels.get(config.shatters.vcs.two);
				break;
			case '3':
				var raidingChannel = spt.channels.get(config.shatters.vcs.three);
				break;
			case '4':
				var raidingChannel = spt.channels.get(config.shatters.vcs.four);
				break;
			case '5':
				var raidingChannel = spt.channels.get(config.shatters.vcs.five);
				break;
			default:
				data.channel.send(`Invalid channel number (available: 1-5).`);
				break;
		}
		
		if (raidingChannel != undefined){
			await raidingChannel.overwritePermissions(data.guild.roles.find(role => role.name == config.shatters.raiderRole), { 'CONNECT': true, 'SPEAK': false });
			await raidingChannel.setName(`raiding`+raiding+` <-- Join!`);
			if (log && raiding != undefined) data.channel.send(`Unlocked channel raiding`+raiding);
		}
	}
}

module.exports = main;