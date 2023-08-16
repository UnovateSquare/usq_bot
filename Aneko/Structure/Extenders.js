const Permissions = require('./Utils/permissions')
const { BaseInteraction, EmbedBuilder, TextChannel, Guild, Client } = require("discord.js");
const Channel = TextChannel;
const config = require('./config');
const axios = require('axios');
const trans = require("@vitalets/google-translate-api");
const Discord = require('discord.js')

// Translate

async function translate(t, tlang) {
    if(!t || !tlang) return console.log(`Invalide text or lang in translate function !`)
    
    s = t.split("%")[1]
    t = t.split("%")[0]
    
    let res;
    if(t) {
     res = await (await trans(t, {to: `${tlang}`})).text;
    } else {
        res = ""
    }
    let f = `${res}`
    if(s) {
        f = `${res} ${s}`
    }
    return f.replace("show", "channel").replace("living room", "channel").replace("room", "channel").replace('CAPTCHA', 'captcha').replace('~~pourcent', '%').replace('canal', 'salon').replace('order', 'command').replace('orders', 'commands')
    .replace(/<# /g, "<#")
    .replace(/<@ /g, "<@")
    .replace(/<@& /g, "<@&")
}

// BaseInteraction
BaseInteraction.prototype.errorMessage = async function(text, options = {}) {
    if(!text) return;

    let eph = options.ephemeral;
    if(typeof eph == "undefined") eph = true;

    let gset = await this.client.findGuild(this.guild.id)

    let t = text;

    let embed1 = new EmbedBuilder()
    .setDescription(`${t}`)
    .setColor(config.color.bot)

let r = await this.reply({ embeds: [embed1], ephemeral: eph, fetchReply: true })
return r;
}

Guild.prototype.getRandomUser = async function() {
    let users = [];
 
    await this.members.cache.forEach(i => {
        users.push(i)
    })
    let mm = Math.floor(Math.random() * users.length)
    let rui = await users[mm]
    
    return rui;
}



Channel.prototype.sendEmbed = async function(em = {}) {  
        return this.send({ embeds: [em] })
}


async function embedSimple(em, emoji, color, trad, type, elem) {
    let gset = await elem.client.findGuild(elem.guild.id)

    if(typeof trad == "undefined") trad = true;

    let t;
    if(trad) { t = await elem.client.translate(em, gset.lang) } else { t = em; }

    let desc = `${t}`
    if(emoji) desc = `${emoji} ${t}`
    // Color
    let clr = config.color.bot
    if(color || !color.length > 0) clr = color;

   let e = new EmbedBuilder().setDescription(`${desc}`).setColor(clr)

    if(type === "channel") { return elem.send({embeds: [e]}) } 
    else { return elem.reply({embeds: [e]}) }
}

BaseInteraction.prototype.embedSimple = async function(em, emoji, color, trad) {
   return await embedSimple(em, emoji, color, trad, "BaseInteraction", this)
}


Channel.prototype.embedSimple = async function(em, emoji) {
    return await embedSimple(em, emoji, color, trad, "channel", this)
 }


// Client


Client.prototype.findGuild = async function(guildId) {
    let gset = await this.db.get(`g_${guildId}`)

    if(!gset.levelBlackListUsers) await this.db.set(`g_${guildId}.levelBlackListUsers`, "/")
    if(!gset.levels) await this.db.set(`g_${guildId}.levels`, "enabled")
    if (!gset) {
        await this.db.set(`g_${guildId}`, {
            levels: "enabled",
            levelBlackListUsers: ''
        })

        gset = await this.db.get(`g_${guildId}`)
      }  
    return gset;
}

// Client 
Client.prototype.translate = async function(t, lang)  {
    s = t.split("%")[1]
    t = t.split("%")[0]
    
    let res = await (await trans(t, {to: `${lang}`})).text;
    let f = `${res}`
    if(s) {
        f = `${res} ${s}`
    }
    return f .replace("show", "channel").replace("living room", "channel").replace("room", "channel").replace('CAPTCHA', 'captcha').replace('~~pourcent', '%').replace('canal', 'salon').replace('order', 'command').replace('orders', 'commands')
    .replace(/<# /g, "<#")
    .replace(/<@ /g, "<@")
    .replace(/<@& /g, "<@&")
}


Client.prototype.makeId = async function(size) {
    let char = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz*$!?^@";
    let strlen = size;
    let random = '';
    for (var i=0; i<strlen; i++) {
        let rnum = Math.floor(Math.random() * char.length);
        random += char.substring(rnum,rnum+1);
    }
    return random;
}

Client.prototype.escapeMarkdown = function(text) {
        return text.replace(">", "\\>").replace("*", "\\*").replace("~~", "\\~~").replace("__", "\\__").replace("`", "\\`")
}


Client.prototype.getPermissionsName = function(BitField) {
    if(!BitField) return;
    let bit = Object.keys(Permissions).find(key => Permissions[key] === BitField)

        bitsplited = bit.split('_')
        console.log(bit)
    bit = bitsplited[0].charAt(0).toUpperCase() + bitsplited[0].substring(1).toLowerCase(); 
    bitsplited[1] ? bit += "_" + bitsplited[1].charAt(0).toUpperCase() + bitsplited[1].substring(1).toLowerCase() :  "" 
    bitsplited[1] && bitsplited[2] ? bit+= "_" + bitsplited[2].charAt(0).toUpperCase() + bitsplited[2].substring(1).toLowerCase() : ""
   
    return bit.replace("_", " ");
}

Client.prototype.getPermissionsBitField = function(PermissionName) {


    return Permissions[PermissionName];
}

Client.prototype.fetchUser = async function(identifier) {
   let response = await axios.get(`https://discord.com/api/v10/users/${identifier}`, {
              headers: {
                Authorization: `Bot ${config.token}`
              }
            }).catch((e) => { })
            if(response) {
                return response.data
            } else {
                return undefined;
            }
}

Client.prototype.randomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
}


Client.prototype.validEmoji = async function(emoji) {
    let btnTest = new Discord.ButtonBuilder().setCustomId('testBtn').setEmoji(emoji).setStyle(Discord.ButtonStyle.Primary)
    try {
    let msg = await this.channels.cache.get(this.config.errorChannel).send({components: [new Discord.ActionRowBuilder().addComponents(btnTest)]})
    msg.delete().catch(() => {})
    return true;
    } catch(err) {
        //console.error(err)
        return false;
    }
}

Client.prototype.sleep = async function(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }