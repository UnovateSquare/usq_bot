const Command = require("../../Structure/Handlers/CommandBase");
const Discord = require('discord.js')

module.exports = class RemoveXp extends Command {
	constructor (client) {
		super(client, {
			name: "removexp",
			description: "Remove xp from a user",
			type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
					name: "user",
					type: Discord.ApplicationCommandOptionType.User,
					description: "User",
					required: true,
				},
                {
					name: "number",
					type: Discord.ApplicationCommandOptionType.Number,
					description: "Number",
					required: true,
				},
            ],
			category: "levels",
			enabled: true,
			usage: "",
			example: "",
			memberPermissions: [Discord.PermissionFlagsBits.ManageGuild],
			botPermissions: [],
			nsfw: false,
			ownerOnly: false,
			cooldown: 1
		});
	}

	async run (client, interaction) {
		let i = interaction;


        let { db } = client; 

        let member = i.options.get('user').value
        member = i.guild.members.cache.get(member)
		let user = member.user;

        let nombre = Math.abs(i.options.get('nombre').value)

        if(user.bot) return i.errorMessage(`Bots don't have levels.`)

        let UserLevel = await db.get(`level_${i.guild.id}_${member.id}`)
        if(!UserLevel) {
            await db.set(`level_${i.guild.id}_${member.id}`, {
                guildId: i.guild.id,
                userId: member.id, 
                xp: 5,
                allXp: 5,
                messages: 1,
                level: 1,
                lastMessage: Date.now(),
                firstMessage: Date.now()
            })
    
            UserLevel = await db.get(`level_${i.guild.id}_${member.id}`)
        }

        console.log(UserLevel)

         let haveRemoved;
        if((UserLevel.level * 100 + 100) < nombre) {
            haveRemoved = (UserLevel.level * 100 + 100) - (UserLevel.xp)
            await db.set(`level_${i.guild.id}_${i.user.id}.xp`, 0)
            await db.sub(`level_${i.guild.id}_${i.user.id}.allXp`, UserLevel.xp)
        } else {
            haveRemoved = nombre
            await db.sub(`level_${i.guild.id}_${user.id}.xp`, nombre)
            await db.sub(`level_${i.guild.id}_${user.id}.allXp`, nombre)
        }


  i.reply({
	content: `I have removed **${haveRemoved}** xp to **${user.username}**`
  })

  }
};