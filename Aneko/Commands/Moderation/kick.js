const Command = require("../../Structure/Handlers/CommandBase");
const Discord = require('discord.js')

module.exports = class Kick extends Command {
	constructor (client) {
		super(client, {
			name: "kick",
			description: "Kick a member",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
				{
					name: "user",
					type: Discord.ApplicationCommandOptionType.User,
					description: "user",
					required: true,
				},
                {
					name: "reason",
					type: Discord.ApplicationCommandOptionType.String,
					description: "reason",
					required: false,
                    min_length: 2,
                    max_length: 256,
				},
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
		let reason = i.options.get('reason')?.value || "No reason provided." 
        reason = `${reason}`;

      
        member = i.guild.members.cache.get(member)

		if(!member) return i.errorMessage('This user is not in the server!')

        if(member.id == i.user.id) return i.errorMessage('You cant kick yourself !')

        if(member.id == client.user.id) return i.errorMessage('You cant kick me !')

        if(member.id === i.guild.ownerId) return i.errorMessage('You cant kick the owner !')
        
	    if(!member.kickable) return i.errorMessage("This user is an admin !")

 
		await member.kick(reason)

   let emb = new Discord.EmbedBuilder()
  .setColor(client.config.color.bot)
  .setAuthor({name:'Kick', iconURL: i.guild.iconURL()})
  .setDescription(`${client.config.emoji.fire} • **${member.user.username}** has been kicked by ${i.user} !`)
  
  i.reply({embeds: [emb]});


  


  }
};