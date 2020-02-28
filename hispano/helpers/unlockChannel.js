const config = require("../../config.json");

async function main(spt, data, raiding, log){
	if (raiding == undefined){
		data.channel.send(`Numero de canal invalido (disponible 1-3).`);
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
			default:
				data.channel.send(`Numero de canal invalido (disponible 1-3).`);
				break;
		}
		
		if (rdgChan != undefined){
			await rdgChan.overwritePermissions(data.guild.roles.find(role => role.name == config.fungal.rdrRole), { 'CONNECT': true, 'SPEAK': false });
			await rdgChan.setName(`raiding `+raiding+` <-- Join!`);
			if (log && raiding != undefined) data.channel.send(`Desbloqueando canal de raid `+raiding);
		}
	}
}

module.exports = main;