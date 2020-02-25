const config = require("../../config.json");

async function main(spt, data){
	let user = data.mentions.users.first();
	if(!user) user = data.author;
	const embed = {
  		"color": 16771920,
  		"description": "["+user.username+"'s avatar]("+user.avatarURL+")",
  		"image": {
    		"url": user.avatarURL
  		}
	};

	data.channel.send({ embed });
}

module.exports = main;