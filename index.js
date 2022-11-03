const { Client, Intents } = require("discord.js");
const Discord = require("discord.js");
const { version } = require("./package.json");

require("dotenv").config();


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
global.client = client;

// Discord Collection for commands
client.commands = new Discord.Collection();
// Cooldowns
client.cooldowns = new Map();
// Module list
client.modules = new Discord.Collection();

// Command handler
const commandBase = require("./command-base.js");

// Command files
commandBase.loadCommandFiles();

client.once("ready", async() => {
    console.log(">> DEBUG: Amuzantiu loaded");
    // Load prefixes
    commandBase.loadPrefixes(client);
    // Update user presence
    client.user.setPresence({ activities: [{ name: `v${version} | ${commandBase.globalPrefix}help` }], status: 'online' });
});

client.login(process.env.TOKEN);