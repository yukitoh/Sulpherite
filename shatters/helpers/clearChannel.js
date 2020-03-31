const config = require("../../config.json");
const isRL = require('../../isRL.js');

async function main(spt, data, args){
	const lnge = spt.channels.get(config.shatters.vc.lnge);

	if (args[1] == undefined){
		data.channel.send(`Invalid channel number (available: 1-5).`);
	} else {
		switch(args[1]){
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

		data.channel.send(`Clearing raiding`+args[1]+`.`)
		.then((msg)=> {
			rdgChan.members.forEach(async function(raiders){
				await isRL(spt, 'shatters', raiders.id).then(async function(value){
					if (value === false) await raiders.setVoiceChannel(lnge);
				})
			})
			msg.delete();
		})
		data.channel.send(`Finished clearing raiding`+args[1]+`.`);
	}
}

module.exports = main;