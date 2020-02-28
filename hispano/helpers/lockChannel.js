const config = require("../../config.json");

async function main(spt, data, raiding, log){
	if (raiding == undefined){
		data.channel.send(`Numero de canal invalido (disponible 1-3)`);
	} else {
		switch(raiding){
			case '1':
				var rdgChan = spt.channels.get(config.hispano.vc.one);
				break;
			case '2':
				var rdgChan = spt.channels.get(config.hispano.vc.two);
				break;
			case '3':
				var rdgChan = spt.channels.get(config.hispano.vc.three);
				break;
			default:
				data.channel.send(`Numero de canal invalido (disponible 1-3)`);
				break;
		}

		if (rdgChan != undefined){
			await rdgChan.overwritePermissions(data.guild.roles.find(role => role.name == config.hispano.rdrRole), { 'CONNECT': false, 'SPEAK': false });
			await rdgChan.setName(`Raiding `+raiding);
			if (log && raiding != undefined) data.channel.send(`Bloqueando canal de raid `+raiding);
		}
	}
}

module.exports = main;