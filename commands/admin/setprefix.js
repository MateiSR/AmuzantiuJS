const { Permissions } = require('discord.js');
const mongo = require('../../mongo.js');
const commandPrefixSchema = require("../../schemas/command-prefix");
const commandBase = require('../../command-base');

module.exports = {
    name: "setprefix",
    description: "Set guild's prefix\nreset - switches prefix back to default",
    permissions: [Permissions.FLAGS.ADMINISTRATOR],
    async execute(message, args) {
        await mongo().then(async(mongoose) => {
            if (!args[0]) return message.react("⛔");
            try {
                const guildId = message.guild.id
                var prefix = args[0]
                if (args[0] == "reset") prefix = commandBase.globalPrefix

                await commandPrefixSchema.findOneAndUpdate({
                    _id: guildId,
                }, {
                    _id: guildId,
                    prefix,
                }, {
                    upsert: true,
                })

                message.reply(`${client.user}'s prefix is now \`${prefix}\``)

                // Update the cache
                commandBase.updateCache(guildId, prefix)
            } finally {
                mongoose.connection.close()
            }
        })
    }
}