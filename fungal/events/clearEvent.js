const config = require("../../config.json");
const isERL = require('../../isERL.js');

async function main(spt, data, args){
	const lnge = spt.channels.get(config.fungal.evt.lnge);

	if (args[1] == undefined){
		data.channel.send(`Invalid channel number (available: 1-4).`);
	} else {
		switch(args[1]){
			case '1':
				var rdgChan = spt.channels.get(config.fungal.evt.one);
				break;
			case '2':
				var rdgChan = spt.channels.get(config.fungal.evt.two);
				break;
			case '3':
				var rdgChan = spt.channels.get(config.fungal.evt.three);
				break;
			case '4':
				var rdgChan = spt.channels.get(config.fungal.evt.four);
				break;
			default:
				data.channel.send(`Invalid channel number (available: 1-4).`);
				break;
		}

		data.channel.send(`Clearing event `+args[1]+`.`)
		.then((msg)=> {
			rdgChan.members.forEach(async function(raiders){
				await isERL(spt, 'fungal', raiders.id).then(async function(value){
					if (!value) await raiders.setVoiceChannel(lnge);
				})
			})
			msg.delete();
		})
		data.channel.send(`Finished clearing event `+args[1]+`.`);
	}
}

module.exports = main;