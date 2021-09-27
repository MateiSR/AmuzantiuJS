const embeds = require("../../utils/embeds.js");

module.exports = {
    name: "bassboost",
    description: "adds bassboost filter to song",
    cooldown: 10000,
    aliases: ["bass", "boost"],
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player || (!player.playing && player.queue.size == 0)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        player.bassboost = !player.bassboost;
        if (player.bassboost) return await message.react("✅");
        else return await message.react("⛔");
    }
}