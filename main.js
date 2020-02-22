const Discord = require('discord.js');
const spt = new Discord.Client();
const config = require('./config.json');
const isRaidleader = require('./isRL.js');
const isEventRaidleader = require('./isERL.js');
var skipPromise = [];
var skipPromiseERL = [];

// heroku part (host)
const express = require('express');
const http = require("http");
const path = require('path');
const app = express()

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/static/index.html'));
})

app.listen(process.env.PORT, function () {
	console.log('heroku is on')
})
//
spt.on('ready', () => {
	// ping every 5m (host)
	setInterval(function() {
    http.get("http://sulpherite.herokuapp.com");
	}, 300000); // every 5 minutes (300000

	console.log('Sulpherite is running!')
	spt.user.setActivity(config.status, { type: ``})
	setInterval(function() {
		// Handling afk checks update
        require("./shatters/commands.js").updateAfkObjs(spt, true);
		require("./fungal/commands.js").updateAfkObjs(spt, true);
		require("./shatters/commands.js").checkDeafen(spt);
		require("./fungal/commands.js").checkDeafen(spt);
    }, 5000);
})


// Main handle..
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
				await isEventRaidleader(spt, 'fungal', data.author.id).then(async function(value){
					await skipPromiseERL.push(value);
				})
				if (data.channel.id == config.fungal.rlBotChannelID && skipPromise[0]){
					// clear skipPromise array for next message
					skipPromise.length = 0;
					// check if bot is alive (highest priority)
					if (data.content == '*slurp'){
						data.channel.send('Slurpie Slurp Slurp')
					}
					require("./fungal/commands.js").main(spt, data);
				} else if(data.channel.id == config.fungal.eventBotChannelID && skipPromiseERL[0] || data.channel.id == config.fungal.eventBotChannelID && skipPromise[0]){
					// clear skipPromise array for next message
					skipPromiseERL.length = 0;
					// check if bot is alive (highest priority)
					if (data.content == '*slurp'){
						data.channel.send('Slurpie Slurp Slurp')
					}
					require("./fungal/events.js").main(spt, data);
				}
				// clear skipPromise array for next message
				skipPromise.length = 0;
				skipPromiseERL.length = 0;
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
spt.login(process.env.TOKEN);