const Command = require("../../Structure/Handlers/CommandBase");
const Discord = require('discord.js')

module.exports = class Warns extends Command {
	constructor (client) {
		super(client, {
			name: "warns",
			description: "Show all warns of a member",
			type: Discord.ApplicationCommandType.ChatInput,
			options: [ 
				{
					name: "user",
					type: Discord.ApplicationCommandOptionType.User,
					description: "Member",
					required: true,
				},
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

        member = i.guild.members.cache.get(member)

        if(!member) return i.errorMessage('This user is not in the server !')

       let warns = await db.get(`warns_${i.guild.id}_${member.id}`)
       console.log(warns)

       let desc;
       if(warns.length > 0) {
       let int = 0;
        desc = warns.map(w => { 
        int++;
        return `**${int} - \`${w.id}\` : ${i.guild.members.cache.get(w.moderator) || ''}**  \n \`\`\` ${w.reason} \`\`\` \n <t:${Math.round(w.date/1000)}:f>`
       }).join('\n \n')
    } else {
        desc = `${member} has not received any warns.`
    }

        i.reply({embeds: [
            new Discord.EmbedBuilder()
            .setColor(client.config.color.bot)
            .setDescription(`${desc}`)
            .setFooter({text: `${warns.length} warns in total`})
            .setAuthor({name: member.displayName, iconURL: member.user.displayAvatarURL()})
        ]})
        
    

  }
};