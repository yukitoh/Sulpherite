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
		// Raiding cmds
		case 'afk':
			var embed = await createEmbed(command, '*afk [channel #] [type of run] <location>', 'Starts an afk check in the channel specified to see how many players are coming to the raid.', 'None');
			channel.send({ embed })
			break;
		case 'headcount': case 'hc':
			var embed = await createEmbed(command, '*headcount [type]', 'Starts a headcount for the respective type of raid.', 'hc');
			channel.send({ embed })
			break;
		case 'clean': case 'clear':
			var embed = await createEmbed(command, '*clean [channel number]', 'Moves all members from the raiding channel to the queue channel', 'clear');
			channel.send({ embed })
			break;
		case 'resetChannel': case 'reset': case 'lock':
			var embed = await createEmbed(command, '*resetChannel', 'Locks the selected channel for raiders.', 'reset, lock');
			channel.send({ embed })
			break;
		case 'location': case 'loc':
			var embed = await createEmbed(command, '*location [new location]', 'Changes the location of the run to the location provided.', 'loc');
			channel.send({ embed })
			break;
		case 'parsemembers': case 'pmChan': case 'pm':
			var embed = await createEmbed(command, '*parseMembers [channel number] [image]', 'Checks the list of users in the voice channel versus the in game image.', 'pmChan, pm');
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
		case 'cmds':
			var embed = await createEmbed(command, '*cmds <command>', 'All available cmds or information on a specific one.', 'None');
			channel.send({ embed })
			break;
	}
}

module.exports = main;