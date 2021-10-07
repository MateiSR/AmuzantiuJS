const { runCheck } = require("../../utils/decorators.js");
const embeds = require("../../utils/embeds.js");

module.exports = {
    name: "back",
    aliases: ["previous"],
    description: "plays previous track",
    async execute(message, args) {
        if (runCheck(message)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not connected to the same voice channel.")] });

        const player = client.manager.players.get(message.guild.id);
        if (!player) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        if (!player.queue.previous) return await message.channel.send({ embeds: [embeds.errorEmbed(`No previous song in queue. [${message.author}]`)] });

        player.queue.add(player.queue.current, 0);
        player.play(player.queue.previous);

    }
}