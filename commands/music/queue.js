const embeds = require("../../utils/embeds.js");
const { chunkArray, parseDuration } = require("../../utils/format.js");
const { runCheck } = require("../../utils/decorators.js");
const current = require("./current.js");
const { MessageEmbed } = require("discord.js");

const getQueuePage = function(player, pageNum) {
    // pageNum = index + 1
    let queueSliced = chunkArray(player.queue, 10);
    let formattedQueue = [];
    var songNum = 0;
    const toSend = new MessageEmbed()
        .setTitle(`Song Queue -  Page ${pageNum}/${queueSliced.length}`)
        .setColor("#5865F2");
    let page = queueSliced[pageNum - 1];

    // Add current track
    if (pageNum == 1) {
        let cTrack = player.queue.current;
        let parsedPosition = parseDuration(player.position);
        let parsedDuration = parseDuration(cTrack.duration);

        formattedQueue.push(`__Now Playing:__\n[${cTrack.title}](${cTrack.uri})\n${parsedPosition} / ${parsedDuration} [${cTrack.requester}]`);
    }
    formattedQueue.push("__Up next__:");

    for (track of page) {
        let trackLength = parseDuration(track.duration);
        formattedQueue.push(`\`${songNum + 1 + 10 * (pageNum - 1)}.\` [${track.title}](${track.uri}) | \`${trackLength}\` [${track.requester}]`);
        songNum++;
    }

    formattedQueue.push(`**${player.queue.length} songs in queue | ${parseDuration(player.queue.duration)} total length**`);
    formattedQueue.push(`**Loop:** ${player.trackRepeat} | **Queue Loop:** ${player.queueRepeat}`)

    toSend.setDescription(formattedQueue.join("\n\n"));

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