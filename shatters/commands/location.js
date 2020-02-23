const config = require("../../config.json");
const afkChecks = require("../commands.js").afkChecks;
const forceUpdate = require("../commands.js").updateAfkObjs;

async function location(spt, data, args){
	if (data.content.substr((args[0].length+1)).length > 3){
		var location = data.content.substr((args[0].length+1));
		var authorafk = data.author.id;
		var currAfkCheckObj;
		for (x in afkChecks) {
			if (afkChecks[x]['host'] == authorafk){
				var currAfkCheckObj = afkChecks[x]
			}
		}
		if (currAfkCheckObj == undefined){
			data.channel.send(`You are not the host of any current afk check.`);
		} else {
			// set location
			currAfkCheckObj['location'] = location;
			// pm key / nitro
			if (currAfkCheckObj['key'] != 'None') currAfkCheckObj['key'].send(`Location has been updated, it is now: \`${location}\``);
			if (currAfkCheckObj['nitro'].length > 0){
				for (x in currAfkCheckObj['nitro']){
					currAfkCheckObj['nitro'][x].send(`Location has been updated, it is now: \`${location}\``);
				}
			}

			data.channel.send(`Location has been successfuly updated.`);
			forceUpdate(spt, false);
		}
	}
}

module.exports = location;