const embeds = require("../../utils/embeds.js");
const { runCheck } = require("../../utils/decorators.js");
const { parseDuration } = require("../../utils/format.js");

module.exports = {
    name: "current",
    aliases: ["now"],
    description: "shows current playing song",
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player || (!player.playing && player.queue.size == 0)) return;
        if (runCheck(message)) return;
        if (player.currentTrack == undefined) return;
        let track = player.currentTrack;
        let parsedDuration = parseDuration(track.duration);
        let parsedPosition = parseDuration(player.position);
        await message.channel.send({ embeds: [embeds.replyEmbed(`Playing [${track.title}](${track.uri})\n ${parsedPosition} / ${parsedDuration} [${track.requester}]`)] });
    }
}