const Discord = require("discord.js")
module.exports = class {
	constructor (client) {
		this.client = client;
	}

	async run (client) {

    client.uptimeTimestamp = new Date().getTime()

    console.log(`${client.user.tag} is ready ! (${client.guilds.cache.size} serveurs - ${client.channels.cache.size} salons - ${client.users.cache.size} users )`);
    console.log(`${client.commands.size} Commandes chargées !`)

    client.user.setPresence({
        status: 'idle',
        activities: [{
            name: `United To Innovate`,
            type: Discord.ActivityType.Listening,
        }]
    });
   }
}