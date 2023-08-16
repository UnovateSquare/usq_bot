const Command = require("../../Structure/Handlers/CommandBase");
const Discord = require('discord.js')
const {resolve} = require('path')
module.exports = class LeaderBoard extends Command {
	constructor (client) {
		super(client, {
			name: "leaderboard",
			description: "Get the level leaderboard",
			type: Discord.ApplicationCommandType.ChatInput,
			category: "levels",
			enabled: true,
			usage: "",
			example: "",
			memberPermissions: [],
			botPermissions: [],
			nsfw: false,
			ownerOnly: false,
			cooldown: 1
		});
	}

	async run (client, interaction) {
		let i = interaction;

        await i.deferReply()

        const db = client.db

        let config = client.config;
        let user = i.user
        let users = await db.startsWith(`level_${i.guild.id}_`);
		
/*
        
           const users = [
    
                {
                    user: 1,
                    level: 5,
                    allXp: 5300
                },
                {
                    user: 2,
                    level: 15,
                    allXp: 15000
                },
                {
                    user: 3,
                    level: 4,
                    allXp: 4000
                },
                {
                    user: 4,
                    level: 19,
                    allXp: 19000
                },
                {
                    user: 5,
                    level: 8,
                    allXp: 8000
                },
                {
                    user: 6,
                    level: 13,
                    allXp: 13000
                },
                {
                    user: 7,
                    level: 2,
                    allXp: 2500
                },
                {
                    user: 8,
                    level: 11,
                    allXp: 11000
                },
                {
                    user: 9,
                    level: 10,
                    allXp: 10500
                },
                {
                    user: 10,
                    level: 1,
                    allXp: 300
                },
    
    
            ]
            */
            
            const AllRankedUsers = users.sort((a, b) => (a.value.allXp < b.value.allXp || !a.value.allXp) ? 1 : -1)
    
    
            //console.log(AllRankedUsers)
    
            let page = 1;
            let sliceStart = 0;
            let perPage = 10; 
            let sliceEnd = perPage;
            
    
    
           function makeEmbed(scStart, scEnd) {
    
    
            
            const rankedUsers = AllRankedUsers.slice(scStart, scEnd)
    
            let userModel = rankedUsers.find(u => u.id === `level_${i.guild.id}_${user.id}`);
            let userPlace = rankedUsers.findIndex(u => u.id === `level_${i.guild.id}_${user.id}`)+1;
    
            const embed = new Discord.EmbedBuilder()
            .setColor(client.config.color.bot)
            .setTitle('**Leaderboard**')
            //.setFooter(`Page ${page}/${Math.round(AllRankedUsers.length / perPage)}`)
    
            let fields = []
            rankedUsers.forEach(u => {
                let userId = u.id.slice((`level_${i.guild.id}_`).length)
                fields.push({name: `**・${i.guild.members.cache.get(userId)?.user.username}** ${client.config.emoji.eclair} #${userPlace}`, value: `\`\`\`Level ${u.value.level} \`\`\``})
            })
    
        
            
            embed.addFields(fields)
    
            return embed;
    
            }
         
          
    
            const first = new Discord.ButtonBuilder()
            .setEmoji(config.emoji.first)
            .setCustomId('first')
            .setStyle(Discord.ButtonStyle.Primary)
            .setDisabled(true)
    
            const back = new Discord.ButtonBuilder()
            .setEmoji(config.emoji.back)
            .setCustomId('back')
            .setStyle(Discord.ButtonStyle.Primary)
            .setDisabled(true)
    
            const next = new Discord.ButtonBuilder()
            .setEmoji(config.emoji.next)
            .setCustomId('next')
            .setStyle(Discord.ButtonStyle.Primary)
            .setDisabled(!(AllRankedUsers.length > perPage))
    
            const last = new Discord.ButtonBuilder()
            .setEmoji(config.emoji.last)
            .setCustomId('last')
            .setStyle(Discord.ButtonStyle.Primary)
            .setDisabled(!(AllRankedUsers.length > perPage))
    
          
    
            function makeRow(p, mP) {
                const btnOfPage = new Discord.ButtonBuilder()
                .setLabel(`${p}/${(AllRankedUsers.length > perPage) ? mP : 1}`)
                .setCustomId('pages')
                .setStyle(Discord.ButtonStyle.Secondary)
                .setDisabled(true)
    
            return new Discord.ActionRowBuilder()
            .addComponents(
               first, back , next, last, btnOfPage,
            )
            }
    
    
            
            function checkPageNumber() {
                let maxPageOfLb = Math.round(AllRankedUsers.length / perPage)
                
    
                if(maxPageOfLb === 0 || maxPageOfLb === 1) {
                   back.setDisabled(true)
                    next.setDisabled(true)
                   first.setDisabled(true)
                   return last.setDisabled(true)
                } else {
                    if(page > 1) {
                        if(maxPageOfLb == page) {
                        next.setDisabled(true)
                        first.setDisabled(false)
                        last.setDisabled(true)
                        return back.setDisabled(false)
                        } else {
                            next.setDisabled(false)
                            first.setDisabled(false)
                        last.setDisabled(false)
                        return back.setDisabled(false)
                        }
                    } else {
                        next.setDisabled(false)
                        first.setDisabled(true)
                        last.setDisabled(false)
                        return back.setDisabled(true)
                    }
                }
            }
    
            
            let msg = await i.editReply({embeds: [makeEmbed(sliceStart, sliceEnd)], components: [makeRow(page, Math.round(AllRankedUsers.length / perPage))]})
    
            const filter = (int) => int.user.id === i.user.id;
            const c = msg.createMessageComponentCollector({ filter, time: 1000000 });
    
    
            c.on("collect", async int => {
    
                if(int.user.id !== i.user.id) return await int.deferUpdate().catch(() => {});
    
               
    
                if(int.componentType === Discord.ComponentType.Button) {
    
    
                    if(int.customId === "next") {
    
                        
                        page = page + 1;
                        sliceStart = sliceStart + perPage;
                        sliceEnd = sliceEnd + perPage;
    
                        await checkPageNumber()
    
                        i.editReply({embeds: [makeEmbed(sliceStart, sliceEnd)], components: [makeRow(page, Math.round(AllRankedUsers.length / perPage))]})
    
                     }
    
    
                     if(int.customId === "back") {
    
                        
                        page = page - 1;
                        sliceStart = sliceStart - perPage;
                        sliceEnd = sliceEnd - perPage;
    
                        await checkPageNumber()
                        
                              i.editReply({embeds: [makeEmbed(sliceStart, sliceEnd)], components: [makeRow(page, Math.round(AllRankedUsers.length / perPage))]})
    
                     }
    
    
                     if(int.customId === "first") {
    
                        
                        page = 1;
                        sliceStart = 0;
                        sliceEnd = perPage;
    
                        await checkPageNumber()
    
                              i.editReply({embeds: [makeEmbed(sliceStart, sliceEnd)], components: [makeRow(page, Math.round(AllRankedUsers.length / perPage))]})
    
                     }
    
                     if(int.customId === "last") {
    
                        
                        page = Math.round(AllRankedUsers.length / perPage);
                        sliceStart = AllRankedUsers.length - perPage;
                        sliceEnd = AllRankedUsers.length;
    
                        await checkPageNumber()
    
                              i.editReply({embeds: [makeEmbed(sliceStart, sliceEnd)], components: [makeRow(page, Math.round(AllRankedUsers.length / perPage))]})
    
                     }
    
                }
    
                await int.deferUpdate().catch(() => {})
    
    
                })
    
          
    
    
      


  }
};