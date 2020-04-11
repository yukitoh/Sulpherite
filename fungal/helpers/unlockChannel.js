const config = require("../../config.json");

async function main(spt, data, raiding, log){
	if (raiding == undefined){
		data.channel.send(`Invalid channel number (available: 1-5).`);
	} else {
		switch(raiding){
			case '1':
				var rdgChan = spt.channels.get(config.fungal.vc.one);
				break;
			case '2':
				var rdgChan = spt.channels.get(config.fungal.vc.two);
				break;
			case '3':
				var rdgChan = spt.channels.get(config.fungal.vc.three);
				break;
			case '4':
				var rdgChan = spt.channels.get(config.fungal.vc.four);
				break;
			case '5':
				var rdgChan = spt.channels.get(config.fungal.vc.five);
				break;
			case '6':
				var rdgChan = spt.channels.get(config.fungal.vc.six);
				break;
			case '7':
				var rdgChanObj = spt.channels.get(config.fungal.vc.seven);
				break;
			default:
				data.channel.send(`Invalid channel number (available: 1-5).`);
				break;
		}
		
		if (rdgChan != undefined){
			await rdgChan.overwritePermissions(data.guild.roles.find(role => role.name == config.fungal.rdrRole), { 'CONNECT': true, 'SPEAK': false });
			await rdgChan.setName(`raiding `+raiding+` <-- Join!`);
			if (log && raiding != undefined) data.channel.send(`Unlocked channel raiding`+raiding);
		}
	}
}

module.exports = main;