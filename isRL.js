const config = require("./config.json");

async function main(spt, server, user){
	if (server == 'fungal'){
		var guildmb = spt.guilds.get(config.fungal.id).members.get(user);
		if (guildmb.roles.some(r => [config.fungal.arlRole, config.fungal.rlRole, config.fungal.vrlRole, config.fungal.hrlRole].includes(r.name))){
			return true;
		} else {
			return false;
		}
	} else if (server == 'shatters'){
		var guildmb = spt.guilds.get(config.shatters.id).members.get(user);
		if (guildmb.roles.some(r => [config.shatters.arlRole, config.shatters.rlRole, config.shatters.vrlRole, config.shatters.hrlRole].includes(r.name))){
			return true;
		} else {
			return false;
		}
	}
}

module.exports = main;