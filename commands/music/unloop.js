const embeds = require("../../utils/embeds.js");
const { runCheck } = require("../../utils/decorators.js");

module.exports = {
    name: "unloop",
    description: "unloops track || queue",
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player || (!player.playing && player.queue.size == 0)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        if (runCheck(message)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not connected to the same voice channel.")] });
        if (player.queueRepeat || player.trackRepeat) {
            // Disables loop
            player.setTrackRepeat(false);
            player.setQueueRepeat(false);
            return await message.channel.send({ embeds: [embeds.replyEmbed(`Stopped looping [${message.author}]`)] });
        }
    }
}