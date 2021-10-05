const { Permissions } = require('discord.js');

module.exports = {
    name: "purge",
    cooldown: 10000,
    permissions: [Permissions.FLAGS.MANAGE_MESSAGES],
    description: "clear number of messages",
    async execute(message, args) {
        if (!args[0]) args[0] = 10;
        if (isNaN(args[0]) || args[0] < 1 || args[0] > 100) return await message.reply("Please specify a number **between 1 and 100**.");

        await message.channel.messages.fetch({ limit: parseInt(args[0]) + 1 }).then(messages => {
            message.channel.bulkDelete(messages);
        })
    }
}