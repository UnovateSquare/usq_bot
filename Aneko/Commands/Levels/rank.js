const Command = require("../../Structure/Handlers/CommandBase");
const Discord = require('discord.js')
const {resolve} = require('path')
module.exports = class Rank extends Command {
	constructor (client) {
		super(client, {
			name: "rank",
			description: "Get your rank",
			type: Discord.ApplicationCommandType.ChatInput,
			options: [
                {
					name: "user",
					type: Discord.ApplicationCommandOptionType.User,
					description: "User",
					required: false,
				},
            ],
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

    const db = client.db    

        let member = i.options.get('user')? i.options.get('user').value : interaction.user.id
        member = i.guild.members.cache.get(member)
		let user = member.user;

    let blackListedUsers = []
    if(blackListedUsers.includes(user.id)) return i.errorMessage(`This user is in the blacklist.`)

    
   
		//console.log(member)

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

    await i.deferReply()

		  /* Ranked */
			let rankedUsers = await db.startsWith(`level_${i.guild.id}_`);
		rankedUsers = rankedUsers.sort((a, b) => (a.value.allXp < b.value.allXp || !a.value.allXp) ? 1 : -1)

		let userModel = rankedUsers.find(u => u.id === `level_${i.guild.id}_${user.id}`);
		//console.log(rankedUsers.map((e) => e.value.level))
		let userPlace = rankedUsers.findIndex(u => u.id === `level_${i.guild.id}_${user.id}`)+1;



		  let xpNeeded = UserLevel.level * 100 + 100
		  let xp = UserLevel.xp;
		  let level = UserLevel.level;
		  let place = userPlace;

      console.log(UserLevel)


		  const { createCanvas, loadImage, registerFont } = require('canvas')
		  const canvas = createCanvas(1440, 606)
		  const ctx = canvas.getContext('2d')

      registerFont('Aneko/Structure/Images/LexendBlack.ttf', { family: "Lexend Black"});
		
		  
		    // Back of the back

  ctx.fillStyle = '#1f1f1f';
 // ctx.fillRect(20, 130, canvas.width-40, canvas.height-260)
  //ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Avatar 
  const avatar = await loadImage(user.displayAvatarURL({extension: 'png', size: 4096, dynamic: false}))
  ctx.drawImage(avatar, 247, 170, 298, 298)




   // Bar

// Back of the back
const backgroundofthebackground = await loadImage(resolve("Aneko/Structure/Images/rankcard/backoftheback.png"))
ctx.drawImage(backgroundofthebackground, 0, 0, canvas.width, canvas.height)


  let percent = xp*100/xpNeeded

  let barWidth = percent*610/100
  
  const my_gradient = ctx.createLinearGradient(0, 0, 0, 170);
my_gradient.addColorStop(0, "#f73afb");
my_gradient.addColorStop(1, "#dc00fa");
my_gradient.addColorStop(0, "#f73afb");

  ctx.fillStyle = my_gradient
  ctx.beginPath();
  ctx.roundRect(625, 299, barWidth, 104, [0, 52, 52, 0])
  ctx.fill()


   // Back 
  const background = await loadImage(resolve("Aneko/Structure/Images/rankcard/rankcard.png"))
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
  
  
  // Username
  let name= user.username.toUpperCase()
  if(name.length > 13) name = name.slice(0, 12)+'...'
  ctx.fillStyle = "#ffffff"
  ctx.font = '60px Lexend Black'
  ctx.textBaseline = 'middle'
  ctx.fillText(name, 641, 250.55)


    
  // XP
  let xpshow = `${xp}/${xpNeeded}`
  ctx.fillStyle = "#ffffff"
  ctx.font = '50px Lexend Black'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillText(xpshow, 641, 445.55)
  
    // Place
    ctx.fillStyle = "#ffffff"
    ctx.font = '50px Lexend Black'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'right'
    ctx.fillText("#"+place, 1190, 445.55)
   

       // Front 
  const front = await loadImage(resolve("Aneko/Structure/Images/rankcard/front.png"))
  ctx.drawImage(front, 0, 0, canvas.width, canvas.height)

  const particles = await loadImage(resolve("Aneko/Structure/Images/rankcard/particles.png"))
  ctx.drawImage(particles, 0, 0, canvas.width, canvas.height)
     
         let attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), 'rank.png')

		 i.editReply({
			files: [attachment]
		 })


    /* let ar = [{name: 'Rank', value:"#"+userPlace},
     {name: 'Level', value:level},
     {name: 'Xp', value:xp+'/'+xpNeeded}].map(e => `${e.name} : ${e.value}`).join('\n')

     i.editReply({
      embeds: [
        new Discord.EmbedBuilder()
        .setColor(client.config.color.bot)
        .setDescription(ar)
      ] 
     }) */



  }
};