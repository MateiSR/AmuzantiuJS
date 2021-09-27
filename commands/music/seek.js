const embeds = require("../../utils/embeds.js");
const { runCheck } = require("../../utils/decorators.js");
const { parseDuration, parseDurationStr } = require("../../utils/format.js");

module.exports = {
    name: "seek",
    cooldown: 1000,
    description: "seeks timestamp in `:` divided format",
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player || (!player.playing && player.queue.size == 0)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        if (runCheck(message)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not connected to the same voice channel.")] });
        if (!args[0]) return;
        let parsedDuration = parseDuration(player.currentTrack.duration);
        let parsedSeekTime = parseDurationStr(args[0]);
        if (parsedSeekTime == NaN) return await message.channel.send({ embeds: [embeds.errorEmbed("Invalid value `(format - dd:hh:mm:ss)`")] });
        if (parsedSeekTime * 1000 > player.currentTrack.duration) return await message.channel.send({ embeds: [embeds.errorEmbed(`Cannot seek more than duration - ${parsedDuration}`)] });
        player.seek(parsedSeekTime * 1000);
        await message.react("✅");
    }
}