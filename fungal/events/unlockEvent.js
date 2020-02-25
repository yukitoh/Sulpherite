const config = require("../../config.json");

async function main(spt, data, evt, log){
	if (evt == undefined){
		data.channel.send(`Invalid channel number (available: 1-4).`);
	} else {
		switch(evt){
			case '1':
				var evtChan = spt.channels.get(config.fungal.evt.one);
				break;
			case '2':
				var evtChan = spt.channels.get(config.fungal.evt.two);
				break;
			case '3':
				var evtChan = spt.channels.get(config.fungal.evt.three);
				break;
			case '4':
				var evtChan = spt.channels.get(config.fungal.evt.four);
				break;
			default:
				data.channel.send(`Invalid channel number (available: 1-4).`);
				break;
		}
		
		if (evtChan != undefined){
			await evtChan.overwritePermissions(data.guild.roles.find(role => role.name == config.fungal.eRole), { 'CONNECT': true, 'SPEAK': false });
			switch(evt){
				case '1':
					await evtChan.setName(`event `+evt+` <-- Join!`);
					break;
				case '2':
					await evtChan.setName(`event `+evt+` <-- Join!`);
					break;
				case '3':
					await evtChan.setName(`realm clearing 1 <-- Join!`);
					break;
				case '4':
					await evtChan.setName(`realm clearing 2 <-- Join!`);
					break;
			}
			if (log && evt != undefined) data.channel.send(`Unlocked channel event`+evt);
		}
	}
}

module.exports = main;