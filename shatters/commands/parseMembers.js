const { createWorker } = require('tesseract.js'),
request = require('request'),
fs = require('fs'),
path = require('path'),
config = require("../../config.json");

async function main(spt, data, args){
	if (args[1] == undefined){
		data.channel.send(`Invalid channel number (available: 1-5).`);
	} else {
		switch(args[1]){
			case '1':
				var raidingChannel = '1';
				break;
			case '2':
				var raidingChannel = '2';
				break;
			case '3':
				var raidingChannel = '3';
				break;
			case '4':
				var raidingChannel = '4';
				break;
			case '5':
				var raidingChannel = '5';
				break;
			default:
				data.channel.send(`Invalid channel number (available: 1-5).`);
				break;
		}

		if (raidingChannel != undefined){
			// Check if there's image
			var ingamescreen;
			if (data.attachments[0] != undefined) ingamescreen = data.attachments.first().url;
			if(!ingamescreen) ingamescreen = args[2];
			if (!ingamescreen) data.channel.send(`No image was input.`);

			if (ingamescreen){
				data.channel.send(`Starting to find members now...`);

				const worker = createWorker();
				(async () => {
					await worker.load();
					await worker.loadLanguage('eng');
					await worker.initialize('eng');
					const { data: { text } } = await worker.recognize(ingamescreen);

					var igRaiders = [];
					preParse = text.split(':')[1];
					fullParse = preParse.replace(/\s+/g, '').trim();
					fixedParse = ((((fullParse.replace(';', ',')).replace(';', ',')).replace(';', ',')).replace(';', ',')).replace(';', ',');
					ingameRaiders = fixedParse.split(',');
					ingameRaiders.forEach(async function(ingameRaider){
						await igRaiders.push(ingameRaider);
					})

					var vcRaiders = [];
					switch(raidingChannel){
						case '1':
							var raidingChannelObj = spt.channels.get(config.shatters.vcs.one);
							break;
						case '2':
							var raidingChannelObj = spt.channels.get(config.shatters.vcs.two);
							break;
						case '3':
							var raidingChannelObj = spt.channels.get(config.shatters.vcs.three);
							break;
						case '4':
							var raidingChannelObj = spt.channels.get(config.shatters.vcs.four);
							break;
						case '5':
							var raidingChannelObj = spt.channels.get(config.shatters.vcs.five);
							break;
					}
					raidingChannelObj.members.forEach(async function(raiders){
						await vcRaiders.push(((raiders.nickname).replace(/[\(\)\=\+\-\#']/, '')).replace(/[\(\)\=\+\-\#']/, ''));
					})

					var crashers = [];
					//var possibleAlts = [];

					ingameRaiders.forEach(async function(igRaider){
						// These people are not in voice channel but they are in game (crashers)
						if (!vcRaiders.includes(igRaider)){
							crashers.push(igRaider);
						}
					})
					// Normally used for possible alts but i can't figure out yet how to find user by nickname

					//vcRaiders.forEach(async function(vcRaider){
						// These people are in voice channel but not in game (possible Alts)
					//	if (!igRaiders.includes(vcRaider)){
					//		possibleAlts.push(vcRaider);
					//	}
					//})

					//var parsePossibleAlts = [];
					//data.channel.send(`**These people are in voice channel #raiding`+raidingChannel+` but not in game, possible alts:**`);
					//if (possibleAlts.length > 0){
					//	possibleAlts.forEach(async function(raiderPossibleAlt){
					//		parsePossibleAlts.push(`<@!`+spt.users.find(user => user.username == raiderPossibleAlt)+`>`)
					//	})
					//	data.channel.send(parsePossibleAlts.join(', '));
					//}

					if (crashers.length > 0){
						data.channel.send(`**These people are not in voice channel #raiding`+raidingChannel+`, they are crashers:**`);
						data.channel.send(crashers.join(', '));

						data.channel.send("```/kick "+crashers.join('\n/kick ')+"```");
					}
					await worker.terminate();
				})();
			}
		}
	}
}

module.exports = main;