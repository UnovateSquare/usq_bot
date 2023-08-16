const Command = require("../../Structure/Handlers/CommandBase");
const Discord = require('discord.js')

module.exports = class Ban extends Command {
	constructor (client) {
		super(client, {
			name: "ban",
			description: "Ban a member",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
				{
					name: "user",
					type: Discord.ApplicationCommandOptionType.User,
					description: "Membre",
					required: true,
				},
                {
					name: "reason",
					type: Discord.ApplicationCommandOptionType.String,
					description: "Raison",
					required: false,
                    min_length: 2,
                    max_length: 256,
				},
                {
					name: "message-to-delete",
					type: Discord.ApplicationCommandOptionType.Number,
					description: "Messages à supprimer",
					required: false,
                    choices: [
                        { name: 'Don\'t delete anything', value: 1 },
                        { name: 'Last hour', value: 2 },
                        { name: 'Last 6 hours', value: 3 },
                        { name: 'Last 12 hours', value: 4 },
                        { name: 'Last 24 hours', value: 5 },
                        { name: 'Derniers 3 days', value: 6 },
                        { name: 'Derniers 7 days', value: 7 },
                    ]
				}
			],
			category: "moderation",
			enabled: true,
			usage: "",
			example: "",
			memberPermissions: [Discord.PermissionFlagsBits.BanMembers],
			botPermissions: [Discord.PermissionFlagsBits.BanMembers],
			nsfw: false,
			ownerOnly: false,
			cooldown: 1
		});
	}

	async run (client, interaction) {
		let i = interaction;

        let member = i.options.get('user').value;
        let deleteMessageDays = i.options.get('message-to-delete')?.value || 0;
        let reason = i.options.get('reason')?.value || "No reason provided." 
        reason = `${reason}`;

        member = i.guild.members.cache.get(member)

        if(!member) return i.errorMessage('This user is not in the server!')

        if(member.id == i.user.id) return i.errorMessage('You cant ban yourself !')

        if(member.id == client.user.id) return i.errorMessage('You cant ban me !')

        if(member.id === i.guild.ownerId) return i.errorMessage('You cant ban the owner !', { notranslate: true })
        
	    if(!member.bannable) return i.errorMessage("This user is an admin !")



  await member.ban({ deleteMessageDays: deleteMessageDays, reason: reason })
   let emb = new Discord.EmbedBuilder()
  .setColor(client.config.color.bot)
  .setAuthor({name:'Ban', iconURL: i.guild.iconURL()})
  .setDescription(`${client.config.emoji.fire} • **${member.user.username}** has been banned by ${i.user} !`)
  
  i.reply({embeds: [emb]});


  


  }
};