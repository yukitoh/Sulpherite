const ping = require('node-http-ping')
const config = require("../config.json");
const isERaidleader = require('../isERL.js');
var skpProE = [];

async function main(spt, data){
	let lwData = data.content.toLowerCase();
	let args = lwData.split(' ');
	if(await isCmd(data)){
		switch ((args[0].replace('*', ''))){
			// Main cmds
			case 'headcount': case 'hc':
				//require("./events/headCount.js")(spt, data);
				data.channel.send(`not coded yet sorry m8`);
				break;
			case 'cleanevent': case 'clearevent':
				require("./events/clearEvent.js")(spt, data, args, true);
				break;
			case 'unlockevent':
				require("./events/unlockEvent.js")(spt, data, args[1], true);
				break;
			case 'resetevent': case 'lockevent':
				require("./events/lockEvent.js")(spt, data, args[1], true);
				break;
			// Miscellanious
			case 'ping':
				ping('https://google.com')
					.then(async function(time){
						var start = new Date()
						await data.channel.send(`Checking..`)
							.then(async function(msg){
								var end = new Date() - start;
								msg.edit(`Bot Latency: ${end}ms, API Latency: ${time}ms`);
							})
					})
				break;
			case 'avatar':
				require("./cmds/avatar.js")(spt, data);
				break;
			case 'cmds': case 'commands':
				if (args[1] != undefined){
					require("./events/commandsHelp.js")(spt, data.channel, args[1]);
					break;
				} else {
					const embed = { "title": "***All the commands you can use on your server!***", "color": 2672880, "footer": { "text": "Capitalization does not matter when using the commands." }, "fields": [ { "name": "**__Raiding:__**", "value": "```fix\nafk; clean; headcount; resetChannel; unlock; parsemembers```"}, { "name": "**__Events:__**", "value": "```fix\ncleanevent; headcount(not yet); resetevent; unlock```"}, { "name": "**__Miscellaneous:__**", "value": "```fix\navatar; commands; slurp; ping```\n-> dm skrillergg if you need a new command.\nTo learn more about a command, use the command *commands <command name>" } ] };
					data.channel.send({ embed });
					break;
				}
			//
		}
	}
}

async function isCmd(data){
	if(data.content.split(' ')[0].startsWith('*')){
		return true;
	} else {
		return false;
	}
}
module.exports.main = main;