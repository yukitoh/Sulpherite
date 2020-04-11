const config = require("../../config.json");
const isRL = require('../../isRL.js');

async function main(spt, data, args, log){
	const lnge = spt.channels.get(config.fungal.vc.lnge);

	if (args[1] == undefined){
		if (log) data.channel.send(`Invalid channel number (available: 1-5).`);
	} else {
		switch(args[1]){
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
				var rdgChan = spt.channels.get(config.fungal.vc.seven);
				break;
			default:
				data.channel.send(`Invalid channel number (available: 1-7).`);
				break;
		}

		if (log) const msg = await data.channel.send(`Clearing raiding`+args[1]+`.`)
		await rdgChan.members.forEach(async function(raiders){
			raiders.setVoiceChannel(lnge);
		})
		msg.delete();
		})
		if (log) await data.channel.send(`Finished clearing raiding`+args[1]+`.`);
	}
}

module.exports = main;