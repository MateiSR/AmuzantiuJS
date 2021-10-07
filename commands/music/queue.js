const embeds = require("../../utils/embeds.js");
const { chunkArray, parseDuration } = require("../../utils/format.js");
const { runCheck } = require("../../utils/decorators.js");
const current = require("./current.js");

const getQueuePage = function(player, pageNum) {
    // pageNum = index + 1
    let queueSliced = chunkArray(player.queue, 10);
    let songLength;
    var formattedQueue = [];
    let c, c2, ret;
    var songNum = 0;
    let page = queueSliced[pageNum - 1];
    // Add current track
    if (pageNum == 1) {
        let cTrack = player.queue.current;
        let cTLength = parseDuration(cTrack.duration);
        c = `--> ${cTrack.title.slice(0, 40)}`;
        c2 = c + " ".repeat(48 - c.length) + cTLength;
        formattedQueue.push(c);
    }

    for (song of page) {
        songLength = parseDuration(song.duration);
        c = `${songNum + 1 + 10 * (pageNum - 1)}) ${song.title.slice(0, 40)}`;
        c2 = c + " ".repeat(48 - c.length) + songLength;
        songNum++;
        formattedQueue.push(c2);
    }
    ret = formattedQueue.join("\n");
    return `\`\`\`nim\nPage ${pageNum}/${queueSliced.length}\n${ret}\`\`\``;
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
            if (parsedPageNum <= queueSliced.length && parsedPageNum >= 1) return await message.channel.send(getQueuePage(player, parsedPageNum));
        }
    }
}