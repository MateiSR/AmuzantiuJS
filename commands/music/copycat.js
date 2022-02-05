const embeds = require("../../utils/embeds.js");
const getArtistTitle = require('get-artist-title');

const { Permissions } = require('discord.js');

module.exports = {
    name: "copycat",
    description: "copy the name of current artist",
    permissions: [Permissions.FLAGS.CHANGE_NICKNAME],
    aliases: ["copyname"],
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player || (!player.playing && player.queue.size == 0)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });

        player.copycat = !player.copycat;
        if (player.copycat) await message.react("✅");
        else {
            try {
            message.guild.members.fetch(client.user.id).then(async member => { member.setNickname(""); });
            } catch (err) {}
            return await message.react("⛔");
        }

        let result = getArtistTitle(player.currentTrack.title);
        if (result) [artist, title] = result;
        else artist = player.currentTrack.title;
        // set bot nickname to "artist"
        await message.guild.members.fetch(client.user.id).then(async member => { member.setNickname(artist.slice(0, 31)); });
    }
}