const { resolve } = require("path");
const Command = require("../../Structure/Handlers/CommandBase");
const Discord = require('discord.js')
module.exports = class Wlc extends Command {
	constructor (client) {
		super(client, {
			name: "wlc",
			description: "Get the latency of the Api",
			type: Discord.ApplicationCommandType.ChatInput,
			options: [],
			category: "general",
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

    const startTimeDB = Date.now()

    let member = i.member;


    const { createCanvas, loadImage, registerFont } = require('canvas')
    const canvas = createCanvas(1440, 606)
    const ctx = canvas.getContext('2d')

registerFont('Aneko/Structure/Images/LexendBlack.ttf', { family: "Lexend Black"});





 ctx.fillStyle = "#000"
 
 
 
 ctx.save();
 
 ctx.translate( 720, -5 );
   ctx.rotate((45 * Math.PI) / 180);
 ctx.beginPath()
 ctx.roundRect(0, 0, 230, 230, 30)
   ctx.clip();

    
   ctx.rotate(-((45 * Math.PI) / 180))
   ctx.translate(-720, 5)
    

   const avatar = await loadImage(member.user.displayAvatarURL({extension: 'png', size: 4096}))
    ctx.drawImage(avatar, 570, 7, 300, 300)
    
    ctx.restore();
    
   
    
    // Back 
 const background = await loadImage(resolve("Aneko/Structure/Images/welcome/back.png"))
 ctx.drawImage(background, 0, 0, canvas.width, canvas.height)


 ctx.textAlign = "center"
 ctx.textBaseline = "middle"
 ctx.fillStyle = "#ffffff"
 ctx.font = "85px Lexend Black"
 ctx.fillText(member.user.username.toUpperCase(), 720, 456)
  

 
let attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), 'rank.png')

i.reply({
   files: [attachment]
})



  }
};