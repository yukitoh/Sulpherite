const Discord = require('discord.js');
const spt = new Discord.Client();
const config = require('./config.json');
const isRaidleader = require('./isRL.js');
var skipPromise = [];

spt.on('ready', () => {
	console.log('Sulpherite is running!')
	spt.user.setActivity(config.status, { type: ``})
	setInterval(function() {
		// Handling afk checks update
        require("./shatters/commands.js").updateAfkObjs(spt, true);
		require("./fungal/commands.js").updateAfkObjs(spt, true);
    }, 5000);
})


// Main handle
spt.on('message', async (data) => {
	if (data.author.bot) return;
	switch (data.guild.id){
		case config.shatters.id:
			if (data.channel.type === 'dm') {
				// DM Commands (Unhandled for now)
			} else {
			// Server Commands
				// obligated to skip promise because annoying
				await isRaidleader(spt, 'shatters', data.author.id).then(async function(value){
					await skipPromise.push(value);
				})
				if (data.channel.id == config.shatters.rlBotChannelID && skipPromise[0]){
					// clear skipPromise array for next message
					skipPromise.length = 0;
					// check if bot is alive (highest priority)
					if (data.content == '*slurp'){
						data.channel.send('Slurpie Slurp Slurp')
					}
					require("./shatters/commands.js").main(spt, data);
				}
				// clear skipPromise array for next message
				skipPromise.length = 0;
			}
			break;
		case config.fungal.id:
			if (data.channel.type === 'dm') {
				// DM Commands (Unhandled for now)
			} else {
			// Server Commands
				// obligated to skip promise because annoying
				await isRaidleader(spt, 'fungal', data.author.id).then(async function(value){
					await skipPromise.push(value);
				})
				if (data.channel.id == config.fungal.rlBotChannelID && skipPromise[0]){
					// clear skipPromise array for next message
					skipPromise.length = 0;
					// check if bot is alive (highest priority)
					if (data.content == '*slurp'){
						data.channel.send('Slurpie Slurp Slurp')
					}
					require("./fungal/commands.js").main(spt, data);
				}
				// clear skipPromise array for next message
				skipPromise.length = 0;
			}
			break;
	}
})

spt.on('messageReactionAdd', (reaction, user) => {
	if (user.bot) return;
	if (reaction.message.channel.type == 'dm') return;
	
	switch(reaction.message.guild.id){
		case config.shatters.id:
			require('./shatters/helpers/handleReaction.js')(spt, reaction, user);
			break;
		case config.fungal.id:
			require('./fungal/helpers/handleReaction.js')(spt, reaction, user);
			break;
	}
})

spt.on('messageReactionRemove', (reaction, user) => {
	if (user.bot) return;
	if (reaction.message.channel.type == 'dm') return;
	
	switch(reaction.message.guild.id){
		case config.shatters.id:
			require('./shatters/helpers/handleDelReaction.js')(spt, reaction, user);
			break;
		case config.fungal.id:
			require('./fungal/helpers/handleDelReaction.js')(spt, reaction, user);
			break;
	}
})

// Login with token
spt.login(config.token);