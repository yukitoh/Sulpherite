const Discord = require('discord.js');
const spt = new Discord.Client();
const config = require('./config.json');
const isRL = require('./isRL.js');
const isERL = require('./isERL.js');
var skpPro = [];
var skpProE = [];

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
        require("./shatters/cmds.js").updAfkObj(spt, true);
		require("./fungal/cmds.js").updAfkObj(spt, true);
		require("./hispano/cmds.js").updAfkObj(spt, true);
		require("./shatters/cmds.js").ckDeaf(spt);
		require("./fungal/cmds.js").ckDeaf(spt);
		require("./hispano/cmds.js").ckDeaf(spt);
    }, 5000);
})


// Main handle..
spt.on('message', async (data) => {
	if (data.author.bot) return;
	if (data.channel.type === 'dm') {
		return spt.channels.get('688446891700125905').send(`${data.author} sent the bot: ${data.content}`);
	}
	switch (data.guild.id){
		case config.shatters.id:
		// Server Commands
			// obligated to skip promise because annoying
			await isRL(spt, 'shatters', data.author.id).then(async function(value){
				await skpPro.push(value);
			})
			console.log(`${data.author.username} is rl on shatters? ${skpPro[0]}`);
			if (data.channel.id == config.shatters.rlChan && skpPro[0]){
				// clear skpPro array for next message
				skpPro.length = 0;
				// check if bot is alive (highest priority)
				if (data.content == '*slurp'){
					data.channel.send('Slurpie Slurp Slurp')
				}
				require("./shatters/cmds.js").main(spt, data);
				// clear skpPro array for next message
			}
			skpPro.length = 0;
			break;
		case config.fungal.id:
		// Server Commands
			// obligated to skip promise because annoying
			await isRL(spt, 'fungal', data.author.id).then(async function(value){
				await skpPro.push(value);
			})
			await isERL(spt, 'fungal', data.author.id).then(async function(value){
				await skpProE.push(value);
			})
			if (data.channel.id == config.fungal.rlChan && skpPro[0]){
				// clear skpPro array for next message
				skpPro.length = 0;
				// check if bot is alive (highest priority)
				if (data.content == '*slurp'){
					data.channel.send('Slurpie Slurp Slurp')
				}
				require("./fungal/cmds.js").main(spt, data);
			} else if(data.channel.id == config.fungal.erlChan && skpProE[0] || data.channel.id == config.fungal.erlChan && skpPro[0]){
				// clear skpPro array for next message
				skpProE.length = 0;
				// check if bot is alive (highest priority)
				if (data.content == '*slurp'){
					data.channel.send('Slurpie Slurp Slurp')
				}
				require("./fungal/events.js").main(spt, data);
			}
			// clear skpPro array for next message
			skpPro.length = 0;
			skpProE.length = 0;
			break;
		case config.hispano.id:
		// Server Commands
			// obligated to skip promise because annoying
			await isRL(spt, 'hispano', data.author.id).then(async function(value){
				await skpPro.push(value);
			})
			if (data.channel.id == config.hispano.rlChan && skpPro[0]){
				// clear skpPro array for next message
				skpPro.length = 0;
				// check if bot is alive (highest priority)
				if (data.content == '*slurp'){
					data.channel.send('Slurpie Slurp Slurp')
				}
				require("./hispano/cmds.js").main(spt, data);
			}
			// clear skpPro array for next message
			skpPro.length = 0;
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
		case config.hispano.id:
			require('./hispano/helpers/handleReaction.js')(spt, reaction, user);
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
		case config.hispano.id:
			require('./hispano/helpers/handleDelReaction.js')(spt, reaction, user);
			break;
	}
})

// Login with token
spt.login(process.env.TOKEN);