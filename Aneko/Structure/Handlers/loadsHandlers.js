const path = require('path');
const fs = require('fs/promises');

async function loadCommands(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory())
      await loadCommands(client, path.join(dir, file));
    if (file.endsWith('.js')) {
      const Command = require(path.join(filePath, file));
      const cmd = new Command(client);

      client.commands.set(cmd.help.name, cmd);
     // console.log(`Registering ${cmd.name}`);
    }
  }
}

async function loadEvents(client) {
      // Load Events
      const evts = await fs.readdir("./Aneko/Events/");
      evts.forEach(async (dir) => {
          const evtfiles = await fs.readdir("./Aneko/Events/"+dir+"/");
          evtfiles.filter((cmd) => cmd.split(".").pop() === "js").forEach(async(file) => {
             const eventName = file.split(".")[0];
             const event = new (require(`../../Events/${dir}/${file}`))(client);
             client.on(eventName, (...args) => event.run(...args, client));
             delete require.cache[require.resolve(`../../Events/${dir}/${file}`)];
          });
      });
 
}

module.exports = {
  loadCommands,
  loadEvents
};