const Discord = require('discord.js')
const { EmbedBuilder, Collection, PermissionsBitField } = Discord;
const config = require('../../Structure/config.json');
require('../../Structure/Extenders')


module.exports = class {
	constructor (client) {
		this.client = client;
	}

	async run (message, client) {


        const db = client.db

		

        if(message.author.bot) return

		let gset = await client.findGuild(message.guild.id)
        message.settings = gset

        // console.log(gset)



        //////////// Levels

        if(gset.levels === "enabled")  {

        let blackListedUsers = []
        let blackListedChannels = []

        if(blackListedChannels.includes(message.channel.id)) return;
        if(blackListedUsers.includes(message.author.id)) return;
        

        let UserLevel = await db.get(`level_${message.guild.id}_${message.author.id}`)
        if(!UserLevel) {
            await db.set(`level_${message.guild.id}_${message.author.id}`, {
                guildId: message.guild.id,
                userId: message.author.id, 
                xp: 5,
                allXp: 5,
                messages: 1,
                level: 1,
                lastMessage: Date.now(),
                firstMessage: Date.now()
            })

            UserLevel = await db.get(`level_${message.guild.id}_${message.author.id}`)
        }

    //    console.log(UserLevel)
        

        await db.set(`level_${message.guild.id}_${message.author.id}.messages`, UserLevel.messages + 1)



            let toAdd = client.randomInt(7, 15);
           
            let xpNeeded = UserLevel.level * 100 + 100


        


            await db.set(`level_${message.guild.id}_${message.author.id}.xp`,  UserLevel.xp + toAdd)
            await db.set(`level_${message.guild.id}_${message.author.id}.allXp`,  UserLevel.allXp + toAdd)
            await db.set(`level_${message.guild.id}_${message.author.id}.lastMessage`,  Date.now())

            UserLevel = await db.get(`level_${message.guild.id}_${message.author.id}`)

            if(UserLevel.xp >= xpNeeded) {
                await db.set(`level_${message.guild.id}_${message.author.id}.level`,  UserLevel.level + 1)
                await db.set(`level_${message.guild.id}_${message.author.id}.xp`,  0)

                let  messageLevelUp = "Congratulations {user.mention}, you just passed the level {level} !" 

                let nextXpNeeded = UserLevel.level * 100 + 100

    /*     let rankedUsers = await Levels.find({guildId: message.guild.id})
                let userPlace;
                if(rankedUsers.length > 1) {
                    rankedUsers = rankedUsers.sort((a, b) => (a.allXp < b.allXp || !a.allXp) ? 1 : -1)
                  let userModel = rankedUsers.find(u => u.userId === message.author.id);
                   userPlace = rankedUsers.findIndex(u => u === userModel) + 1
                } else {
                    userPlace = 1
                }*/

                messageLevelUp = messageLevelUp
                .replace(/{level}/g, UserLevel.level+1)
                .replace(/{user.name}/g, message.author.username)
                .replace(/{user.mention}/g, message.author)
                .replace(/{user.id}/g, message.author.id)
                .replace(/{user.tag}/g, message.author.tag)
                .replace(/{xpToNextLevel}/g, nextXpNeeded)
             //   .replace(/{place}/g, userPlace)
                
           

                message.reply({
                    content: messageLevelUp.toString()
                })

        

             }


         }
        // End of level part
    



        


















	/*	if(message.content.startsWith('banss')) {
			['235148962103951360', '276060004262477825', '491769129318088714', '993883372357156865', '998655248358973512', '998887625593192478', '1009283922632376421', '1012084918743998506']
			.forEach(async lmao => {
				await message.guild.bans.create(lmao)
			})
		}*/


		if(message.content.startsWith("eval")) {
            if(message.author.id !== "810475442880118784") return;

		function clean(text) {
            if (typeof text === "string")
                return text
                    .replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        }
    
        try {
            const code = message.content.slice(4);
            let evaled = eval(code);
    
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
    
            var emb = new Discord.EmbedBuilder()
                .setTitle('Résultat')
                .setDescription(`\`\`\`js` + '\n' + clean(evaled).slice(0, 2060) + `\n` + `\`\`\``)
                .setColor(config.color.bot)
            message.channel.send({embeds: [emb]});
        } catch (err) {
            var emb = new Discord.EmbedBuilder()
                .setTitle('Résultat')
                .setDescription(`\`\`\`js` + '\n' + clean(err) + `\n` + `\`\`\``)
                .setColor(config.color.bot)
            message.channel.send({embeds: [emb]});
        }

	}


      

	}


}