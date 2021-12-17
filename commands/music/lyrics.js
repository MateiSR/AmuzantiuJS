const { MessageEmbed } = require("discord.js");
const embeds = require("../../utils/embeds.js");

module.exports = {
    name: "lyrics",
    description: "Searches for lyrics of a song",
    async execute(message, args) {
        if (!args[0]) {
            const player = client.manager.players.get(message.guild.id);
            if (!player || (!player.playing && player.queue.size == 0)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
            const track = player.currentTrack;
            var search = track.title;
        } else {
            var search = args.join(" ");
        }

        try {
            var searches = await geniusClient.songs.search(search);
        } catch (e) {
            return await message.channel.send({ embeds: [embeds.errorEmbed(`No lyrics found for search: \`${search}\``)] });
        }
        const lyrics = await searches[0].lyrics();

        var lyricsToSend = lyrics.trim();
        if (lyrics.length > 2000) {
            lyricsToSend = lyricsToSend.slice(0, 2000);
            lyricsToSend += "...";
        }

        const reply = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`Lyrics for - ${searches[0].fullTitle}`)
            .setDescription(lyricsToSend)
            .setFooter(`Search: \`${search}\` | Requested by ${message.author.tag}`);

        await message.channel.send({ embeds: [reply] });
    }
}