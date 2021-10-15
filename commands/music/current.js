const embeds = require("../../utils/embeds.js");
const { runCheck } = require("../../utils/decorators.js");
const { MessageEmbed } = require("discord.js");
const { parseDuration } = require("../../utils/format.js");
const { progressBar } = require("../../utils/progressBar.js");

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
        let parsedPosition = parseDuration(player.position);
        let parsedDuration = parseDuration(track.duration);
        const currentSong = new MessageEmbed()
            .setColor("#5865F2")
            .setTitle(`🎵   Now playing`)
            .setThumbnail(track.thumbnail)
            .setDescription(`[${track.title}](${track.uri})`)
            .addField("Channel", track.author, true)
            .addField("Position", `\`\`\`${progressBar(player.position, track.duration, 20)} ${parsedPosition} / ${parsedDuration}\`\`\``)
        await message.channel.send({ embeds: [currentSong] });
    }
}