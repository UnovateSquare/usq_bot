const Command = require("../../Structure/Handlers/CommandBase");
const Discord = require('discord.js')

module.exports = class Ping extends Command {
	constructor (client) {
		super(client, {
			name: "ping",
			description: "Get the latency of the Api",
			type: Discord.ApplicationCommandType.ChatInput,
			options: [],
			category: "general",
			enabled: true,
			usage: "",
			example: "",
			memberPermissions: [],
			botPermissions: [],
			nsfw: false,
			ownerOnly: false,
			cooldown: 1
		});
	}

	async run (client, interaction) {
		let i = interaction;

    const startTimeDB = Date.now()

   await client.findGuild(i.guild.id)

        const endTimeDB = Date.now()

    let firstReply = await i.reply({content: `🏓 Pinging...`, fetchReply: true })
   const ctrTsmp = Date.now()
    
    let em = new Discord.EmbedBuilder()
    .setColor(`${i.guildSettings.color}`)
    .addFields([
    {name: 'Bot Latency', value:"```" + Math.floor(parseInt(firstReply.createdTimestamp)- parseInt(interaction.createdTimestamp)) + " ms ``\`", inline:true},
    {name: 'API Latency', value:`\`\`\`${client.ws.ping} ms \`\`\``, inline: true},
    {name: 'Database Latency', value:`\`\`\`${Math.floor(endTimeDB- startTimeDB)} ms \`\`\``, inline: false}
    ])
    i.editReply({content: "🏓 Pong", embeds: [em]})

  }
};