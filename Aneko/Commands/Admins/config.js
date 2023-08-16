const Command = require("../../Structure/Handlers/CommandBase");
const Discord = require('discord.js');
const config = require("../../Structure/config.json");
const fs = require('fs')
module.exports = class SendPanel extends Command {
	constructor (client) {
		super(client, {
			name: "config",
			description: "Config",
			type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
					name: "logs-channel",
					type: Discord.ApplicationCommandOptionType.Channel,
					description: "Channel of logs",
					required: false,
				},
                {
					name: "ticket-category",
					type: Discord.ApplicationCommandOptionType.Channel,
					description: "Category of tickets",
					required: false,
				},
                {
					name: "ticket-role",
					type: Discord.ApplicationCommandOptionType.Role,
					description: "Role of tickets support",
					required: false,
				},
                {
					name: "auto-role",
					type: Discord.ApplicationCommandOptionType.Role,
					description: "Role of autorole",
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
			ownerOnly: true,
			cooldown: 1
		});
	}

	async run (client, interaction) {
		let i = interaction;


       // var m = JSON.parse(fs.readFileSync("Aneko/Structure/config.js").toString());


       // console.log(m)
        

        let logschannel = i.options.get('logs-channel')?.value
		if(logschannel) {
        logschannel = i.guild.channels.cache.get(logschannel)

        if(logschannel) {
			config.logsChannel = logschannel.id


			fs.writeFileSync("./Aneko/Structure/config.json", JSON.stringify(config, null, 2))

			return i.reply({
				content: `Le salon des logs a été défini sur ${logschannel}`
			})
        }

	}


		let ticketcategory = i.options.get('ticket-category')?.value
		if(ticketcategory) {
        ticketcategory = i.guild.channels.cache.get(ticketcategory)

		if(ticketcategory.type !== Discord.ChannelType.GuildCategory) return i.errorMessage('Ce salon n\'est pas une catégorie.')

        if(ticketcategory) {
			config.ticketCategory = ticketcategory.id


			fs.writeFileSync("./Aneko/Structure/config.json", JSON.stringify(config, null, 2))

			return i.reply({
				content: `La catégorie des tickets a été défini sur ${ticketcategory.name}`
			})
        }
	}


		let supportrole = i.options.get('ticket-role')?.value
		if(supportrole) {
        supportrole = i.guild.roles.cache.get(supportrole)

        if(supportrole) {
			config.ticketSupportRoleId = supportrole.id


			fs.writeFileSync("./Aneko/Structure/config.json", JSON.stringify(config, null, 2))

			return i.reply({
				content: `Le rôle des tickets a été défini sur ${supportrole.name}`
			})
        }

	}

		let autorole = i.options.get('auto-role')?.value
		if(autorole) {
        autorole = i.guild.roles.cache.get(autorole)

        if(autorole) {
			config.autorole = autorole.id


			fs.writeFileSync("./Aneko/Structure/config.json", JSON.stringify(config, null, 2))

			return i.reply({
				content: `L'auto rôle a été défini sur ${autorole.name}`
			})
        }
	}




  }
};