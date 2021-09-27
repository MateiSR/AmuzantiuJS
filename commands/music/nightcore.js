const embeds = require("../../utils/embeds.js");

module.exports = {
    name: "nightcore",
    description: "adds nightcore filter to song",
    cooldown: 10000,
    aliases: ["nc"],
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player || (!player.playing && player.queue.size == 0)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        player.nightcore = !player.nightcore;
        if (player.nightcore) return await message.react("✅");
        else return await message.react("⛔");
    }
}