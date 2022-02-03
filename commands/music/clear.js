const { runCheck } = require("../../utils/decorators.js");
const embeds = require("../../utils/embeds.js");

module.exports = {
    name: "clear",
    aliases: ["stop"],
    description: "clears queue",
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        if (runCheck(message)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not connected to the same voice channel.")] });
        await player.queue.clear();
        if (player.playing) player.stop();
        await message.channel.send({ embeds: [embeds.replyEmbed(`Cleared queue [${message.author}]`)] });
    }
}