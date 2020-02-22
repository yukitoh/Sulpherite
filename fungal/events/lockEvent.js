const config = require("../../config.json");

async function main(spt, data, event, log){
	if (event == undefined){
		data.channel.send(`Invalid channel number (available: 1-5).`);
	} else {
		switch(event){
			case '1':
				var eventChannel = spt.channels.get(config.fungal.event.one);
				break;
			case '2':
				var eventChannel = spt.channels.get(config.fungal.event.two);
				break;
			case '3':
				var eventChannel = spt.channels.get(config.fungal.event.three);
				break;
			case '4':
				var eventChannel = spt.channels.get(config.fungal.event.four);
				break;
			default:
				data.channel.send(`Invalid channel number (available: 1-5).`);
				break;
		}
		
		if (eventChannel != undefined){
			await eventChannel.overwritePermissions(data.guild.roles.find(role => role.name == config.fungal.raiderRole), { 'CONNECT': false, 'SPEAK': false });
			switch(event){
				case '1':
					await eventChannel.setName(`event `+event);
					break;
				case '2':
					await eventChannel.setName(`event `+event);
					break;
				case '3':
					await eventChannel.setName(`realm clearing `+event);
					break;
				case '4':
					await eventChannel.setName(`realm clearing `+event);
					break;
			}
			if (log && event != undefined) data.channel.send(`Locked channel event`+event);
		}
	}
}

module.exports = main;