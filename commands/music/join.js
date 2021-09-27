const embeds = require("../../utils/embeds.js");

module.exports = {
    name: "join",
    aliases: ["joinchannel", "joinvc", "j"],
    description: "joins and binds to your voice channel",
    async execute(message, args) {
        var player = client.manager.players.get(message.guild.id);
        if (!message.member.voice.channel) return;
        // Create a new player. This will return the player if it already exists.
        if (!player) {
            player = client.manager.create({
                guild: message.guild.id,
                voiceChannel: message.member.voice.channel.id,
                textChannel: message.channel.id,
                selfDeafen: true,
            });
            await player.connect();
            await message.channel.send({ embeds: [embeds.replyEmbed(`Bound to \`${message.member.voice.channel.name}\` [${message.author}]`)] });
        } else {
            if (player.voiceChannel == message.member.voice.channel.id) return;
            player.stop();
            player.queue.clear();
            player.setVoiceChannel(message.member.voice.channel.id);
            await message.channel.send({ embeds: [embeds.replyEmbed(`Bound to \`${message.member.voice.channel.name}\` and cleared queue [${message.author}]`)] });
        }
    }
}