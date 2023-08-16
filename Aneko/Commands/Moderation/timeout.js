const Command = require("../../Structure/Handlers/CommandBase");
const Discord = require('discord.js')

module.exports = class Timeout extends Command {
	constructor (client) {
		super(client, {
			name: "timeout",
			description: "Timeout a member",
            type: Discord.ApplicationCommandType.ChatInput,
			options: [
                {
					name: "user",
					type: Discord.ApplicationCommandOptionType.User,
					description: "Member",
					required: true,
				},
                {
					name: "duration",
					type: Discord.ApplicationCommandOptionType.Number,
					description: "duration",
					required: true,
                    choices: [
                        { name: '60 seconds', value: (60 * 1000) },
                        { name: '5 minutes', value: (300 * 1000) },
                        { name: '10 minutes', value: (600 * 1000) },
                        { name: '30 minutes', value: (1800 * 1000) },
                        { name: '1 hour', value: (3600 * 1000) },
                        { name: '3 hours', value: (10800 * 1000) },
                        { name: '12 hours', value: (43200 * 1000) },
                        { name: '1 day', value: (86400 * 1000) },
                        { name: '3 days', value: (259200 * 1000) },
                        { name: '1 week', value: (604800 * 1000) },
                    ]
				},
                {
					name: "reason",
					type: Discord.ApplicationCommandOptionType.String,
					description: "Reason",
					required: false,
                    min_length: 2,
                    max_length: 256,
				}
            ],
			category: "moderation",
			enabled: true,
			usage: "",
			example: "",
			memberPermissions: [Discord.PermissionFlagsBits.KickMembers],
			botPermissions: [Discord.PermissionFlagsBits.KickMembers],
			nsfw: false,
			ownerOnly: false,
			cooldown: 1
		});
	}

	async run (client, interaction) {
		let i = interaction;

        let member = i.options.get('user').value;
        let duration = i.options.get('duration')?.value || 0;
        let reason = i.options.get('reason')?.value || "No reason provided."
        reason = `${reason}`;

        member = i.guild.members.cache.get(member)

        if(!member) return i.errorMessage('This user is not in the server!')

        if(member.id == i.user.id) return i.errorMessage('You cant timeout yourself !')

        if(member.id == client.user.id) return i.errorMessage('You cant timeout me !')

        if(member.id === i.guild.ownerId) return i.errorMessage('You cant timeout the owner !', { notranslate: true })
        
	    if(!member.moderatable) return i.errorMessage("This user is an admin !")

      

        let durations = {
         60000: `60 seconds`,
         300000: `5 minutes`,
         600000: `10 minutes`,
         1800000: `30 minutes`,
         3600000: `1 hour`,
         10800000: `3 hours`,
         43200000: `12 hours`,
         86400000: `1 day`,
         258200000: `3 days`,
         604800000: `1 week`,
        }

  await member.timeout(duration, reason)

   let emb = new Discord.EmbedBuilder()
  .setColor(`${client.config.color.bot}`)
  .setAuthor({name:'Sanction', iconURL: i.guild.iconURL()})
  .setDescription(`**${member}** has been timeout for ${durations[duration]} by ${i.user} !`)
  
  i.reply({embeds: [emb], components: []});


  }
};