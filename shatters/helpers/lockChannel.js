const config = require("../../config.json");

async function main(spt, data, raiding, log){
	if (raiding == undefined){
		data.channel.send(`Invalid channel number (available: 1-5).`);
	} else {
		switch(raiding){
			case '1':
				var rdgChan = spt.channels.get(config.shatters.vc.one);
				break;
			case '2':
				var rdgChan = spt.channels.get(config.shatters.vc.two);
				break;
			case '3':
				var rdgChan = spt.channels.get(config.shatters.vc.three);
				break;
			case '4':
				var rdgChan = spt.channels.get(config.shatters.vc.four);
				break;
			case '5':
				var rdgChan = spt.channels.get(config.shatters.vc.five);
				break;
			default:
				data.channel.send(`Invalid channel number (available: 1-5).`);
				break;
		}

		if (rdgChan != undefined){
			await rdgChan.overwritePermissions(data.guild.roles.find(role => role.name == config.shatters.rdrRole), { 'CONNECT': false, 'SPEAK': false });
			await rdgChan.setName(`raiding`+raiding);
			if (log && raiding != undefined) data.channel.send(`Locked channel raiding`+raiding);
		}
	}
}

module.exports = main;