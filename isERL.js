const config = require("./config.json");

async function main(spt, server, authorid){
	if (server == 'fungal'){
		var guildmb = spt.guilds.get(config.fungal.id).members.get(authorid);
		if (guildmb.roles.some(r => [config.fungal.erlRole].includes(r.name))){
			return true;
		} else {
			return false;
		}
//	} else if (server == 'shatters'){
//		var guildmb = spt.guilds.get(config.shatters.id).members.get(authorid);
//		if (guildmb.roles.some(r => [config.shatters.arlRole, config.shatters.rlRole, config.shatters.vrlRole, config.shatters.hrlRole].includes(r.name))){
//			return true;
//		} else {
//			return false;
//		}
	}
}

module.exports = main;