const Discord = require('discord.js')
const { EmbedBuilder, Collection, PermissionsBitField } = Discord;
const config = require('../../Structure/config.json');
require('../../Structure/Extenders')

module.exports = class {
	constructor (client) {
		this.client = client;
	}

	async run (oldMessage, newMessage, client) {

                let message = newMessage

        //console.log(message)

        if(!message.content) return;
        if(message.author.id === client.user.id) return;



        const { AuditLogEvent } = require('discord.js');

const fetchedLogs = await message.guild.fetchAuditLogs({
	type: AuditLogEvent.MessageDelete,
	limit: 1,
});

const firstEntry = fetchedLogs.entries.first();

console.log(firstEntry)




        let embed = new EmbedBuilder()
        .setColor(config.color.bot)
        .setAuthor({name: "Message edited", iconURL: message.author.displayAvatarURL()})
        .addFields({name: "Before :", value: "```"+oldMessage.content+"```"})
        .addFields({name: "After :", value: "```"+newMessage.content+"```"})
        .addFields({name: "Author :", value: "```"+message.author.username+"```"})
        .setTimestamp()

        let logs = client.guilds.cache.get(config.mainServer).channels.cache.get(config.logsChannel)
        if(!logs) return

        logs.send({embeds: [embed]})
 
      


    }
}