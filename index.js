const { Client, Intents } = require("discord.js");
const Discord = require("discord.js");
const { version } = require("./package.json");

const prefix = "a ";

const fs = require("fs");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
global.client = client;
global.prefix = prefix;

// Discord Collection for commands
client.commands = new Discord.Collection();
// Cooldowns
client.cooldowns = new Map();
// Module list
client.modules = new Discord.Collection();

// Read command files
const commandDirs = fs.readdirSync("./commands/").filter(dir => !dir.startsWith("_"));
for (const dir of commandDirs) {
    // Initialize in module collection
    client.modules.set(dir, new Array());
    // Load module
    console.log(`> DEBUG: Loading module: ${dir}`);
    const commandFiles = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js") && !file.startsWith("_"));
    const loadFiles = fs.readdirSync(`./commands/${dir}/`).filter(file => file.startsWith("_"));
    // run load files
    for (const file of loadFiles) require(`./commands/${dir}/${file}`);
    // register command files
    for (const file of commandFiles) {
        const command = require(`./commands/${dir}/${file}`);
        // Set command module for help menu
        //client.modules[dir].push(command.name);
        client.modules.get(dir).push(command.name);
        command["module"] = dir;
        // Set base command
        client.commands.set(command.name, command);
        console.log(`>> ${dir}/${file}`);
    }
}

// Command handling
client.on("messageCreate", async message => {
    // Only responds to user-created commands
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    // Separate command & arguments
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // Check if command exists & handle aliases
    c = client.commands.get(command) || client.commands.find(a => a.aliases && a.aliases.includes(command));
    if (c == undefined) return;

    // Permissions check
    if (c.permissions) {
        for (const permission of c.permissions) {
            if (!message.member.permissions.has(permission)) return await message.reply(`You don't have the necessary permissions.`);
        }
    }

    // Check cooldown
    if (!client.cooldowns.has(c.name)) client.cooldowns.set(c.name, new Discord.Collection());
    const currentTime = Date.now();
    const timestamps = client.cooldowns.get(c.name);
    const cooldownAmount = c.cooldown; // in ms
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (currentTime < expirationTime) {
            const cooldownLeft = (expirationTime - currentTime) / 1000;
            return await message.reply(`Please wait **${cooldownLeft.toFixed(1)}** seconds before using that command again.`);
        }
    }
    timestamps.set(message.author.id, currentTime);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Check whitelist/blacklist
    if (c.whitelist) {
        if (!c.whitelist.includes(message.author.id.toString())) return;
    }
    if (c.blacklist) {
        if (c.blacklist.includes(message.author.id.toString())) return;
    }

    // Run command
    try {
        await c.execute(message, args);
    } catch (error) {
        console.error(error); // debug
    };
});

client.once("ready", async() => {
    console.log(">> DEBUG: Amuzantiu loaded");
    // Update user presence
    client.user.setPresence({ activities: [{ name: `v${version} | ${prefix}help` }], status: 'online' });
});

client.login(process.env.TOKEN);