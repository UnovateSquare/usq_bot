const Command = require("../../Structure/Handlers/CommandBase");
const Discord = require('discord.js')

module.exports = class SendPanel extends Command {
	constructor (client) {
		super(client, {
			name: "sendpanel",
			description: "Send the ticket panel",
			type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
					name: "channel",
					type: Discord.ApplicationCommandOptionType.Channel,
					description: "Channel",
					required: false,
				},
            ],
			category: "general",
			enabled: true,
			usage: "",
			example: "",
			memberPermissions: [Discord.PermissionFlagsBits.Administrator],
			botPermissions: [],
			nsfw: false,
			ownerOnly: false,
			cooldown: 1
		});
	}

	async run (client, interaction) {
		let i = interaction;


        await i.deferReply()

        let channel = i.options.get('channel')? i.options.get('channel').value : i.channel.id

        channel = i.guild.channels.cache.get(channel)

        


        const file = new Discord.AttachmentBuilder('Aneko/Structure/Images/ticketpanel.png')
        const file2 = new Discord.AttachmentBuilder('Aneko/Structure/Images/ticketbanner.png')

        let imageEm = new Discord.EmbedBuilder()
        .setColor(client.config.color.bot)
        .setImage('attachment://ticketpanel.png')

        let panelEm = new Discord.EmbedBuilder()
        .setColor(client.config.color.bot)
        .setTitle('Creation of a ticket')
        .setDescription('Please select a category between these:')
        .addFields(
            {name: '<:announcement:1125777396398829628> Help', value: "> For any question on the server"},
            {name: '<:fire:1125776438050693230> Report', value: "> To report a member"},
        //    {name: '<:mailbox:1125776799608082572> Partnership', value: "> To make a partnership request"},
            {name: '<a:star:1125777039316766772> Other', value: "> For another reason than these 4"},
        )
        .setImage('attachment://ticketbanner.png')


        let row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.StringSelectMenuBuilder()
            .setCustomId('ticketsPanel')
            .setPlaceholder('Select the category')
            .addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                .setValue('aide')
                .setEmoji('<:announcement:1125777396398829628>')
                .setLabel('Help'),

                new Discord.StringSelectMenuOptionBuilder()
                .setValue('report')
                .setEmoji('<:fire:1125776438050693230>')
                .setLabel('Report'),

                /*new Discord.StringSelectMenuOptionBuilder()
                .setValue('partenariat')
                .setEmoji('<:mailbox:1125776799608082572>')
                .setLabel('Partnership'),*/

                new Discord.StringSelectMenuOptionBuilder()
                .setValue('autre')
                .setEmoji('<a:star:1125777039316766772>')
                .setLabel('Other'),

            )
    
        )

        let secImageEm = new Discord.EmbedBuilder()
        .setColor(client.config.color.bot)
        .setImage('attachment://ticketbanner.png')


        await channel.send({ embeds: [imageEm, panelEm], components: [row], files: [file, file2] });

        i.editReply({content: 'Panel sent !'})
  



  }
};