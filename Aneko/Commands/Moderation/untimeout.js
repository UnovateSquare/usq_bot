const Command = require("../../Structure/Handlers/CommandBase");
const Discord = require('discord.js')

module.exports = class UnTimeout extends Command {
	constructor (client) {
		super(client, {
			name: "untimeout",
			description: "Remove timeout of a member",
            type: Discord.ApplicationCommandType.ChatInput,
			options: [
                {
					name: "user",
					type: Discord.ApplicationCommandOptionType.User,
					description: "Member",
					required: true,
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
        let reason = i.options.get('reason')?.value || "No reaons provided." 
        reason = `${reason}`;

        member = i.guild.members.cache.get(member)
        if(!member) return i.errorMessage('This user is not in the server !')

        if(!member.isCommunicationDisabled()) return i.errorMessage("This user is not timeout !")

        if(!member.moderatable) return i.errorMessage("This user is an admin !")

 let memberUserNameDesc = `${member}`;

  await member.timeout(null, reason)
   let emb = new Discord.EmbedBuilder()
  .setColor(`${client.color.bot}`)
  .setAuthor({name:'Sanction', iconURL: i.guild.iconURL()})
  .setDescription(`Timeout of ${memberUserNameDesc} has been removed by ${i.user} !`)
  
  i.reply({embeds: [emb], components: []});


  


  }
};