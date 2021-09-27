const embeds = require("../../utils/embeds.js");
const { runCheck } = require("../../utils/decorators.js");

module.exports = {
    name: "pause",
    description: "pauses current track",
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player || (!player.playing && player.queue.size == 0)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        if (runCheck(message)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not connected to the same voice channel.")] });
        if (!player.paused) player.pause(true);
        else return await message.channel.send({ embeds: [embeds.errorEmbed("Player is already paused.")] });
        await message.react("⏯️");
    }
}