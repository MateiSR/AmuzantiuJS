const embeds = require("../../utils/embeds.js");
const { runCheck } = require("../../utils/decorators.js");

module.exports = {
    name: "unpause",
    aliases: ["resume"],
    description: "unpauses player",
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player || (!player.playing && player.queue.size == 0 && !player.paused)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        if (runCheck(message)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not connected to the same voice channel.")] });
        if (player.paused) player.pause(false);
        else return await message.channel.send({ embeds: [embeds.errorEmbed("Player is not paused.")] });
        await message.react("⏯️");
    }
}