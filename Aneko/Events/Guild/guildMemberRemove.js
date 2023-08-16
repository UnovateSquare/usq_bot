const Discord = require('discord.js')
const { EmbedBuilder, Collection, PermissionsBitField } = Discord;
const config = require('../../Structure/config.json');
require('../../Structure/Extenders')

module.exports = class {
	constructor (client) {
		this.client = client;
	}

	async run (member, client) {

        console.log(member)

        await client.sleep(2000)

        const { AuditLogEvent } = require('discord.js');

const fetchedLogs = await member.guild.fetchAuditLogs({
	type: AuditLogEvent.MemberKick,
	limit: 1,
});



const firstEntry = fetchedLogs.entries.first();

if(!firstEntry && firstEntry.action !== AuditLogEvent.MemberKick) return;

console.log(firstEntry)



        let embed = new EmbedBuilder()
        .setColor(config.color.bot)
        .setAuthor({name: "Kicked member", iconURL: member.user.displayAvatarURL()})
        .addFields({name: "Member :", value: "```"+member.user.username+"```"})
        .addFields({name: "Moderator :", value: "```"+firstEntry.executor.username+"```"})
        .addFields({name: "Reason :", value: "```"+(firstEntry.reason || "No reason provided.") +"```"})
        .setTimestamp()

        let logs = client.guilds.cache.get(config.mainServer).channels.cache.get(config.logsChannel)
        if(!logs) return

        logs.send({embeds: [embed]})
 
      


    }
}