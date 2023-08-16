const Discord = require('discord.js')
const { EmbedBuilder, Collection, PermissionsBitField } = Discord;
const ms = require('ms');
const config = require('../../Structure/config.json');
require('../../Structure/Extenders')

const discordTranscripts = require('discord-html-transcripts');
const fetchAll = require('discord-fetch-all');
const { createTs } = require('discord-html-transcripts-hyperscale')

module.exports = class {
	constructor (client) {
		this.client = client;
	}

	async run (interaction, client) {
		let i = interaction;

		let gset = {}
		gset.lang === "en"

		const { db } = client;

		if(!i.guild) return i.reply({embeds: [new EmbedBuilder().setColor(config.color.bot).setDescription(`${config.emoji.error} My commands cannot be executed in dm.`)]})

		if(i.isButton()) {

			if(i.customId.startsWith('t_')) {

				let customId = i.customId.split('_')[1]
				let userId = i.customId.split('_')[2]

				console.log(userId)

				if(customId === "close") {

				i.reply({
					embeds: [
						new Discord.EmbedBuilder()
						.setColor(config.color.bot)
						.setDescription(`The ticket has been closed.`)
					],
					components: [
						new Discord.ActionRowBuilder()
						.addComponents(
							new Discord.ButtonBuilder()
							.setStyle(Discord.ButtonStyle.Secondary)
							.setLabel('Open')
							.setCustomId("t_reopen_"+userId)
							.setEmoji('🔓'),

							new Discord.ButtonBuilder()
							.setStyle(Discord.ButtonStyle.Secondary)
							.setLabel('Transcription')
							.setCustomId("t_transcript_"+userId)
							.setEmoji('📜'),

							new Discord.ButtonBuilder()
							.setStyle(Discord.ButtonStyle.Danger)
							.setLabel('Delete')
							.setCustomId("t_delete_"+userId)
						)
					]
				})

				i.channel.permissionOverwrites.edit(userId, { SendMessages: false });

			}

			if(customId === "reopen") {

				i.message.delete()
				i.channel.permissionOverwrites.edit(userId, { SendMessages: true });

			}

			if(customId === "transcript") {

				await i.deferReply()

				 const allMessages = await fetchAll.messages(i.channel, {
					reverseArray: true, // Reverse the returned array
					userOnly: false, // Only return messages by users
					botOnly: false, // Only return messages by bots
					pinnedOnly: false, // Only returned pinned messages
				});// Must be Collection<string, Message> or Message[]
				const messages = allMessages.slice(0, -1)

				//console.log(allMessages)

				const attachment = await discordTranscripts.generateFromMessages(messages, i.channel);
			

				await i.editReply({
					files: [attachment],
				  });
			}

			if(customId === "delete") {

				await i.reply({content: "The ticket will be deleted."})
				setTimeout(() => {
					i.channel.delete().catch(() => {})
				}, 5000)


				let allTickets = await db.get(`tickets_${i.guild.id}`)
					allTickets = allTickets.filter(t => t.channelId !== i.channelId)
					await db.set(`tickets_${i.guild.id}`, allTickets)
			}







			}

		}

		if(i.isStringSelectMenu()) {



			console.log(i)


			if(i.customId === "ticketsPanel") {

				let category = i.values[0]
				console.log(category)

				i.message.edit({components: [i.message.components[0]]})

				let allTickets = await db.get(`tickets_${i.guild.id}`)
				
				let hasTicket = false;

				let userTicket = await allTickets?.find(t => t.category === category && t.userId === i.user.id)
				
				if(userTicket) {
				if(userTicket) hasTicket = true;
				let userTicketChannel = i.guild.channels.cache.get(userTicket.channelId)

				if(!userTicketChannel) {
					hasTicket = false;

					allTickets = allTickets.filter(t => t.channelId !== userTicket.channelId)
					await db.set(`tickets_${i.guild.id}`, allTickets)
				}
				
				if(hasTicket) return i.reply({content: `You already have a ticket, ${userTicketChannel}`, ephemeral: true})

			}


			

				let newChannel = await i.guild.channels.create({
					name: category+'-'+i.user.username,
					type: Discord.ChannelType.GuildText,
					parent: config.ticketCategory,
					permissionOverwrites: [
						{
						  id: i.user.id,
						  accept: [Discord.PermissionFlagsBits.ViewChannel],
					   },
					   {
						id: (i.guild.roles.cache.get(config.ticketSupportRoleId)?.id || i.user.id),
						accept: [Discord.PermissionFlagsBits.ViewChannel],
					   },
					   {
						id: i.guild.id,
					 	deny: [Discord.PermissionFlagsBits.ViewChannel]
					   }
					 ],
				});
				if(!newChannel) return;

				await db.push(`tickets_${i.guild.id}`, {
					channelId: newChannel.id,
					userId: i.user.id,
					category: category,
				})


				i.reply({content: `Your ticket has been created, ${newChannel}`, ephemeral: true})

				



				newChannel.send({
					content: `${i.user} ${i.guild.roles.cache.get(config.ticketSupportRoleId)}`,
					embeds: [
						new Discord.EmbedBuilder()
						.setColor(config.color.bot)
						.setDescription(`Thanks for opening a ticket, the staff will be here soon. \n To close this ticket, click on **🔒 Close**.`)
					],
					components: [
						new Discord.ActionRowBuilder()
						.addComponents(
							new Discord.ButtonBuilder()
							.setStyle(Discord.ButtonStyle.Secondary)
							.setEmoji("🔒")
							.setLabel('Close')
							.setCustomId('t_close_'+i.user.id)
						)
					]
				})

			}

	
		
		}



		// Slash Commands
        if(!i.isChatInputCommand()) return;

	
		if (i.guild && !i.member) {
		  await i.guild.members.fetch(i.member.user.id);
	  }

	  

	  

	  

	

	  const command = client.commands.get(i.commandName);
	  if (!command) return;


let permissions = command.help.memberPermissions;
if (permissions) {    
    for (const permission of permissions) {      
     if(!i.memberPermissions.has(permission)) {
		 return i.errorMessage(`${gset.lang === "fr" ? "Vous n’avez pas la permission d’utiliser cette commande." : "You do not have the required permissions to use this command."}`, {notranslate: true, ephemeral: true});
	 }
    }
}

let botpermissions = command.help.botPermissions;
if (botpermissions) {     
    for (const permission of botpermissions) {      
       if (!i.guild.members.cache.get(client.user.id).permissions.has(permission)) {
           return i.errorMessage(`${gset.lang === "fr" ? `Il me manque la permission \`${client.getPermissionsName(parseInt(permission.toString()))}\` pour éxécuter cette commande !` : `I miss the permission \`${client.getPermissionsName(parseInt(permission.toString()))}\` to execute this command !`}`, {notranslate: true, ephemeral: true});
        }     
    }
}

if(!client.cooldowns.has(command.help.name)) {
	client.cooldowns.set(command.help.name, new Discord.Collection());
  }
  
  const timeNow = Date.now();
  const tStamps = client.cooldowns.get(command.help.name);
  const cdAmount = (command.help.cooldown || 5) * 1000;
  
  if(tStamps.has(i.member.user.id+"_"+i.guild.id)) {
	const cdExpirationTime = tStamps.get(i.member.user.id+"_"+i.guild.id) + cdAmount;
  
	if(timeNow < cdExpirationTime) {
	 let timeLeft = (cdExpirationTime - timeNow) / 1000;
	  if(timeLeft > 3600) { 
		let tim = Math.floor(timeLeft.toFixed(0) / 3600)
		let tims = Math.floor(timeLeft.toFixed(0) / 60)
		return i.errorMessage(`${gset.lang === "fr" ? `Veuillez attendre **${tim}** heures avant de pouvoir refaire cette commande !` : `Please wait **${tim}** hours before you can do this command again!`}`, {notranslate: true, ephemeral: true});
	  }
	  if(timeLeft > 60) { 
		let tim = Math.floor(timeLeft.toFixed(0) / 60)
		return i.errorMessage(`${gset.lang === "fr" ?  `Veuillez attendre **${tim}** minutes avant de pouvoir refaire cette commande !` : `Please wait **${tim}** minutes before you can do this command again!`}`, {notranslate: true, ephemeral: true});
	  }
	 
	  else {
		let tim = timeLeft.toFixed(0).replace(/0/gi, "1");
	  return i.errorMessage(`${gset.lang === "fr" ? `Veuillez attendre **${tim}** seconde(s) avant de pouvoir refaire cette commande !` : `Please wait **${tim}** secondes before you can do this command again!`}`, {notranslate: true, ephemeral: true});
	  }
	}
  }
  
  tStamps.set(i.member.user.id+"_"+i.guild.id, timeNow)
  
  setTimeout(() => tStamps.delete(i.member.user.id+"_"+i.guild.id), cdAmount);
  

command.run(client, i)
		




















	}


}