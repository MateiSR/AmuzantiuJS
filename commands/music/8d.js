const embeds = require("../../utils/embeds.js");

module.exports = {
    name: "8d",
    aliases: ["eightd", "3d", "9d"],
    description: "adds 8d filter to song",
    cooldown: 10000,
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player || (!player.playing && player.queue.size == 0)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        player.eightD = !player.eightD;
        if (player.eightD) return await message.react("✅");
        else return await message.react("⛔");
    }
}