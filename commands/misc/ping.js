const embeds = require("../../utils/embeds.js");

module.exports = {
    name: "ping",
    aliases: ["latency"],
    description: "retrieves bot latency",
    async execute(message, args) {
        // ping = Date.now() - message.createdTimestamp;
        await message.channel.send("Pinging..").then(async m => {
            let latency = m.createdTimestamp - message.createdTimestamp;
            await m.delete();
            await message.channel.send({ embeds: [embeds.replyEmbed(`Latency is \`${latency}ms\``)] });
        })
    }
}