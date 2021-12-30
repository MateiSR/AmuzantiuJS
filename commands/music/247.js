const embeds = require("../../utils/embeds.js");

module.exports = {
    name: "247",
    description: "keeps the bot in vc 24/7",
    aliases: ["24/7"],
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        player._247 = !player._247;
        if (player._247) return await message.react("✅");
        else {
            if (!player.playing && player.queue.size == 0) {
                player.timeoutID = setTimeout(() => {
                    client.channels.cache
                        .get(player.textChannel)
                        .send({ embeds: [embeds.replyEmbed("Left voice channel after no activity for `10 minutes`.")] });
                    player.destroy();
                }, 10 * 60 * 1000);
            }
            return await message.react("⛔")};
    }
};
