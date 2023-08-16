const Command = require("../../Structure/Handlers/CommandBase");
const Discord = require('discord.js')

module.exports = class Ping extends Command {
	constructor (client) {
		super(client, {
			name: "deletewarn",
			description: "Delete warn of a member",
			type: Discord.ApplicationCommandType.ChatInput,
			options: [ 
				{
					name: "user",
					type: Discord.ApplicationCommandOptionType.User,
					description: "Member",
					required: true,
				},
                {
					name: "id",
					type: Discord.ApplicationCommandOptionType.String,
					description: "Identifier of warn",
					required: true,
                    min_length: 6,
                    max_length: 6,
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
        let id = i.options.get('id')?.value || "Aucune raison donnée..." 
        id = `${id}`;

        member = i.guild.members.cache.get(member)

        if(!member) return i.errorMessage('This user is not in the server!')

        if(member.id == i.user.id) return i.errorMessage('You cant delete your warns !')

        if(member.id == client.user.id) return i.errorMessage('I cant receive warn !')

        if(member.id === i.guild.ownerId) return i.errorMessage('The owner cant receive warn', { notranslate: true })



        let warns = await db.get(`warns_${i.guild.id}_${member.id}`)
        console.log(warns)

        if(warns.filter(w => w.id == id).length <= 0) return i.errorMessage(`No warns of ${member} has the id \`${id}\` !`)

       let warnsFiltered = warns.filter(w => w.id !== id)


       await db.set(`warns_${i.guild.id}_${member.id}`, warnsFiltered)


        i.reply({embeds: [
            new Discord.EmbedBuilder()
            .setColor(client.config.color.bot)
            .setDescription(`The warn of ${member} has been deleted !`)
        ]})
        
    

  }
};