const embeds = require("../../utils/embeds.js");
const { runCheck } = require("../../utils/decorators.js");

module.exports = {
    name: "remove",
    description: "removes a song from queue by id",
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player || (!player.playing && player.queue.size == 0)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        if (runCheck(message)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not connected to the same voice channel.")] });
        let parsedSongNum = parseInt(args[0]);
        if (parsedSongNum == NaN || !parsedSongNum) return;
        if (parsedSongNum > player.queue.size) return await message.channel.send({ embeds: [embeds.errorEmbed("There is no such song in queue.")] });
        player.queue.remove(parsedSongNum - 1);
        await message.react("✅");
    }
}