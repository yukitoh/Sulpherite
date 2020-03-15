const config = require("../../config.json");
const https = require('https');

async function main(spt, data, args){
	if (args[1] == undefined){
		data.channel.send(`Invalid channel number (available: 1-5).`);
	} else {
		switch(args[1]){
			case '1':
				var rdgChan = '1';
				break;
			case '2':
				var rdgChan = '2';
				break;
			case '3':
				var rdgChan = '3';
				break;
			case '4':
				var rdgChan = '4';
				break;
			case '5':
				var rdgChan = '5';
				break;
			default:
				data.channel.send(`Invalid channel number (available: 1-5).`);
				break;
		}

		if (rdgChan != undefined){
			// Check if there's image
			var ingamescreen;
			if (data.attachments.size > 0) ingamescreen = data.attachments.first().url;
			if(!ingamescreen) ingamescreen = args[2];
			if (!args[2] || !ingamescreen) data.channel.send(`No image was input.`);

			if (ingamescreen){
				data.channel.send(`Starting to find members now...`);
				var apiUrl = `https://api.ocr.space/parse/imageurl?apikey=4c09473bec88957&url=${ingamescreen}&scale=true`;
				
				https.get(apiUrl, (resp) => {
					let data = '';

					resp.on('data', (chunk) => {
    					data += chunk;
					});

					resp.on('end', () => {
						var endtext = JSON.parse(data).ParsedResults[0].ParsedText;
						var firstParse = endtext.split(':')[1].split(' ').join('');
						var fixedParse = firstParse.replace(/\n|\r/g, "");
						var ingameRaiders = fixedParse.split(',');

						var igRaiders = [];
					
						ingameRaiders = fixedParse.split(',');
						ingameRaiders.forEach(async function(ingameRaider){
							await igRaiders.push(ingameRaider);
						})

						var vcRaiders = [];
						switch(rdgChan){
							case '1':
								var rdgChanObj = spt.channels.get(config.shatters.vc.one);
								break;
							case '2':
								var rdgChanObj = spt.channels.get(config.shatters.vc.two);
								break;
							case '3':
								var rdgChanObj = spt.channels.get(config.shatters.vc.three);
								break;
							case '4':
								var rdgChanObj = spt.channels.get(config.shatters.vc.four);
								break;
							case '5':
								var rdgChanObj = spt.channels.get(config.shatters.vc.five);
								break;
						}
						rdgChanObj.members.forEach(async function(raiders){
							await vcRaiders.push(((raiders.nickname).replace(/[\(\)\=\+\-\#']/, '')).replace(/[\(\)\=\+\-\#']/, ''));
						})

						var crashers = [];
						var possibleAlts = [];

						ingameRaiders.forEach(async function(igRaider){
							// These people are not in voice channel but they are in game (crashers)
							if (!vcRaiders.includes(igRaider)){
								crashers.push(igRaider);
							}
						})

						vcRaiders.forEach(async function(vcRaider){
							// These people are in voice channel but not in game (possible Alts)
							if (!igRaiders.includes(vcRaider)){
								possibleAlts.push(vcRaider);
							}
						})

						var parsePossibleAlts = [];
						data.channel.send(`**These people are in voice channel #raiding`+rdgChan+` but not in game, possible alts:**`);
						if (possibleAlts.length > 0){
							possibleAlts.forEach(async function(raiderPossibleAlt){
								parsePossibleAlts.push(`<@!`+raiderPossibleAlt.displayName+`>`)
							})
							data.channel.send(parsePossibleAlts.join(', '));
						}

						if (crashers.length > 0){
							data.channel.send(`**These people are not in voice channel #raiding`+rdgChan+`, they are crashers:**`);
							data.channel.send(crashers.join(', '));
							data.channel.send("```/kick "+crashers.join('\n/kick ')+"```");
						}
					});
				}).on("error", (err) => {
					data.channel.send("Error while parsing: " + err.message);
				});
			}
		}
	}
}

module.exports = main;