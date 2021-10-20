const mongo = require("./mongo.js");
const commandPrefixSchema = require("./schemas/command-prefix");
const guildPrefixes = {}
const Discord = require("discord.js");
const fs = require("fs");

const { prefix: globalPrefix } = "a ";
global.prefix = globalPrefix;
module.exports.globalPrefix = "a ";

// Command handling
client.on("messageCreate", async message => {

    // Prefix handler
    const prefix = guildPrefixes[message.guild.id] || globalPrefix;

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
        if (!message.channel.permissionsFor(message.author.id).has(c.permissions)) return await message.reply("You **don't** have the necessary permissions **in this channel**.");
        if (!message.channel.permissionsFor(client.user.id).has(c.permissions)) return await message.reply(`${client.user} **doesn't** have the necessary permissions **in this channel**.`);
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
    if (c.whitelist && !c.whitelist.includes(message.author.id.toString())) return;
    if (c.blacklist && c.blacklist.includes(message.author.id.toString())) return;

    // Run command
    try {
        await c.execute(message, args);
    } catch (error) {};
});

module.exports.loadCommandFiles = async() => {
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
}

/**
 * I forgot to add this function to the video.
 * It updates the cache when the !setprefix command is ran.
 */
module.exports.updateCache = (guildId, newPrefix) => {
    guildPrefixes[guildId] = newPrefix
}

module.exports.loadPrefixes = async(client) => {
    await mongo().then(async(mongoose) => {
        try {
            for (const guild of client.guilds.cache) {
                const guildId = guild[1].id

                const result = await commandPrefixSchema.findOne({ _id: guildId })
                guildPrefixes[guildId] = result.prefix
            }

        } finally {
            mongoose.connection.close()
        }
    })
}