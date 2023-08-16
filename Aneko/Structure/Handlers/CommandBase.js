const { ApplicationCommandType } = require('discord.js');
    
    module.exports = class Command {
	constructor(client, {
		name = null,
		type = ApplicationCommandType.ChatInput,
		options = new Array(),
        description = null,
		category = null,
		enabled = true,
		usage = null,
		example = null,
		botPermissions = new Array(),
		memberPermissions = new Array(),
		nsfw = false,
		ownerOnly = false,
		cooldown = 1000,
		subCommands = []
	})
	{
		this.client = client;
		this.name = name;
		this.description = description;
		this.type = type;
		this.subCommands = subCommands;
		this.options = options;
		this.help = { name, category, enabled, usage, example, description, memberPermissions, botPermissions, nsfw, ownerOnly, cooldown};
	}
};