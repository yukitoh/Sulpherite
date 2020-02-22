const config = require("../../config.json");

async function createEmbed(command, usage, description, aliases){
	const embed = {
  	"title": "**Info on the "+command+" command!**",
  	"color": 2672880,
  	"description": ("**__Usage:__** `"+usage+"`\n-"+description+"\nAliases: "+aliases),
  	"footer": {
    	"text": "Capitalization does not matter | [] - mandatory | <> - optional"
		}
	};

	return embed;
}

async function main(spt, channel, command){
	switch (command){
		// Raiding commands
		case 'headcount': case 'hc':
			var embed = await createEmbed(command, '*headcount [type]', 'Starts a headcount for the respective type of raid.', 'hc');
			channel.send({ embed })
			break;
		case 'cleanevent': case 'clearevent':
			var embed = await createEmbed(command, '*cleanevent [channel number]', 'Moves all members from the raiding channel to the queue channel', 'clearevent');
			channel.send({ embed })
			break;
		case 'resetevent': case 'lockevent':
			var embed = await createEmbed(command, '*resetevent', 'Locks the selected channel for raiders.', 'resetevent, lockevent');
			channel.send({ embed })
			break;
		case 'unlockevent':
			var embed = await createEmbed(command, '*unlockevent', 'Locks the selected channel for raiders.', 'resetevent, lockevent');
			channel.send({ embed })
			break;
		// Miscellanious
		case 'avatar':
			var embed = await createEmbed(command, '*avatar <@user>', 'Gets the avatar url of someone or yourself.', 'None');
			channel.send({ embed })
			break;
		case 'slurp':
			var embed = await createEmbed(command, '*slurp', 'Used to know if the bot is alive or not, maximum priority.', 'None');
			channel.send({ embed })
			break;
		case 'ping':
			var embed = await createEmbed(command, '*ping', 'Gets the bots ping.', 'None');
			channel.send({ embed })
			break;
		case 'commands':
			var embed = await createEmbed(command, '*commands <command>', 'All available commands or information on a specific one.', 'None');
			channel.send({ embed })
			break;
	}
}

module.exports = main;