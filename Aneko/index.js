// https://discord-api-types.dev/api/discord-api-types-v9/enum/ApplicationCommandOptionType
// Imports
const config = require('./Structure/config.json')
require('./Structure/Extenders')
const { loadCommands, loadEvents } = require('./Structure/Handlers/loadsHandlers');
const { Client, Routes, Collection, Partials, GatewayIntentBits } = require('discord.js');

// Create Aneko
const client = new Client({
   intents: 131071, 
   rest: { version: '10' },
   partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
  });
  client.cooldowns = new Collection()
  client.rest.setToken(config.token);
  client.config = config;
  client.color = config.color;



  //const config = require('./Structure/config.json')
  //config.prefix = "test"
  //console.log(JSON.stringify(config, null, 2))



  const { QuickDB } = require("quick.db");
  const db = new QuickDB();

  client.db = db

                  //console.log(manager)



  async function main() {
    try {
      client.commands = new Collection();
      await loadCommands(client, "../../Commands");
      await loadEvents(client);

      client.commands.sort((a, b) => a.name.localeCompare(b.name))


      const slashCommandsJson = []
      
      client.commands.forEach((cmd) => {
      //  cmd.data.toJSON()

      let commandToPush = {
        name: cmd.name,
        type: cmd.type,
        dm_permission: false,
        options: cmd.options?.length > 0 ? cmd.options : null
      }

      let desc = cmd.description;


      if(typeof desc === "object") {
        commandToPush.description = desc['en-US'];
        commandToPush.description_localizations = desc
      } else {
        commandToPush.description = desc;
      }

      slashCommandsJson.push(commandToPush)
    });
     // console.log(slashCommandsJson);
      await client.rest.put(Routes.applicationCommands(config.clientID), {
        body: slashCommandsJson,
      });

      await client.login(config.token);
    } catch (err) {
      console.log(err);
    }
  }

 main();

 // Errors Handlers
 process
    .on('unhandledRejection', err => {
        console.log(err)
        return client.channels.cache.get("1127658269964505108").send({content: `<t:${Math.round(Date.now() / 1000)}>\n\`\`\`${err.stack}\`\`\``})
    })
    .on("uncaughtException", err => {
        console.log(err)
        return client.channels.cache.get("1127658269964505108").send({content: `<t:${Math.round(Date.now() / 1000)}>\n\`\`\`${err.stack}\`\`\``})
    })

    

    