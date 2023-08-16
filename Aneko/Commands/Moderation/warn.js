const Command = require("../../Structure/Handlers/CommandBase");
const Discord = require('discord.js')

module.exports = class Ping extends Command {
	constructor (client) {
		super(client, {
			name: "warn",
			description: "Warn a member",
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
			memberPermissions: [Discord.PermissionFlagsBits.ManageMessages],
			botPermissions: [],
			nsfw: false,
			ownerOnly: false,
			cooldown: 1
		});
	}

	async run (client, interaction) {
		let i = interaction;

        const { db } = client;


        let member = i.options.get('user').value;
        let reason = i.options.get('reason')?.value || "No reason provided." 
        reason = `${reason}`;

        member = i.guild.members.cache.get(member)


        if(!member) return i.errorMessage('This user is not in the server!')

        if(member.id == i.user.id) return i.errorMessage('You cant warn yourself !')

        if(member.id == client.user.id) return i.errorMessage('You cant warn me !')

        if(member.id === i.guild.ownerId) return i.errorMessage('You cant warn the owner !', { notranslate: true })
        

        let id = await client.makeId(6)


        await db.push(`warns_${i.guild.id}_${member.id}`, {
            id: id,
            reason: reason,
            moderator: i.user.id,
            date: Date.now()
        })


        i.reply({embeds: [
            new Discord.EmbedBuilder()
            .setColor(client.config.color.bot)
            .setDescription(`${member} has been warned !`)
        ]})
        
    

  }
};