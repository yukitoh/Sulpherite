const config = require("../../config.json");
const afks = require("../cmds.js").afks;
const fceUpd = require("../cmds.js").updAfkObj;

async function location(spt, data, args){
	if (data.content.substr((args[0].length+1)).length > 3){
		var location = data.content.substr((args[0].length+1));
		var authorafk = data.author.id;
		var currAfk;
		for (x in afks) {
			if (afks[x]['host'] == authorafk){
				var currAfk = afks[x]
			}
		}
		if (currAfk == undefined){
			data.channel.send(`You are not the host of any current afk check.`);
		} else {
			// set location
			currAfk['location'] = location;
			// pm key / nitro
			if (currAfk['key'] != 'None') currAfk['key'].send(`Location has been updated, it is now: \`${location}\``);
			if (currAfk['nitro'].length > 0){
				for (x in currAfk['nitro']){
					currAfk['nitro'][x].send(`Location has been updated, it is now: \`${location}\``);
				}
			}

			data.channel.send(`Location has been successfuly updated.`);
			fceUpd(spt, false);
		}
	}
}

module.exports = location;