const embeds = require("../../utils/embeds.js");
const { runCheck } = require("../../utils/decorators.js");

module.exports = {
    name: "shuffle",
    description: "shuffles queue",
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player || (!player.playing && player.queue.size == 0)) return;
        if (runCheck(message)) return;
        if (player.currentTrack == undefined) return;
        player.queue.shuffle();
        await message.channel.send({ embeds: [embeds.replyEmbed(`Queue has been shuffled. [${message.author}]`)] });
    }
}