const embeds = require("../../utils/embeds.js");
const { chunkArray, parseDuration } = require("../../utils/format.js");
const { runCheck } = require("../../utils/decorators.js");
const current = require("./current.js");
const { MessageEmbed } = require("discord.js");

const getQueuePage = function(player, pageNum) {
    // pageNum = index + 1
    let queueSliced = chunkArray(player.queue, 10);
    const toSend = new MessageEmbed()
        .setTitle(`Queue for ${player.guild} | Page ${pageNum}/${queueSliced.length}`);
    let page = queueSliced[pageNum - 1];

    // Add current track
    if (pageNum == 1) {
        let cTrack = player.queue.current;
        let parsedPosition = parseDuration(player.position);
        let parsedDuration = parseDuration(cTrack.duration);
        toSend.addField(`Now playing: [${cTrack.title}](${cTrack.uri})`, `Among`)
    }

    return toSend;
};

module.exports = {
    name: "queue",
    aliases: ["q"],
    description: "shows queue",
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (runCheck(message)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not connected to the same voice channel.")] });
        if (!player || (!player.playing && player.queue.size == 0)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        if ((player.playing || player.paused) && player.queue.size == 0) return await current.execute(message, args);
        let queueSliced = chunkArray(player.queue, 10);
        let parsedPageNum = parseInt(args[0]);
        if (!args[0]) parsedPageNum = 1;
        if (parsedPageNum != NaN) {
            if (parsedPageNum <= queueSliced.length && parsedPageNum >= 1) return await message.channel.send({ embeds: [getQueuePage(player, parsedPageNum)] });
        }
    }
}