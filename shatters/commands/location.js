const config = require("../../config.json");
const afkChecks = require("../commands.js").afkChecks;

async function location(spt, data, args){
	if (data.content.substr((args[0].length+1)).length > 3){
		var location = data.content.substr((args[0].length+1);
		console.log(`new location is:`+location);
	}
}

module.exports = location;