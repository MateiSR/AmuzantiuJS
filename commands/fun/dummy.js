const dummyGuilds = {};
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: "dummy",
    description: "disconnect dummy!",
    async execute(message, args) {
        if (!message.member.voice.channel) return await message.reply("You aren't connected to voice");
        const player = client.manager.players.get(message.guild.id);
        if (player) return message.reply("Currently playing, stop music to continue");
        if (Object.keys(dummyGuilds).includes(message.guild.id)) {
            delete dummyGuilds[message.guild.id];
            await message.react("⛔");
            try {
                const connection = getVoiceConnection(message.guild.id);
                connection.destroy();
            } catch {}
        } else {
            dummyGuilds[message.guild.id] = message.member.voice.channel.id;
            await message.react("✅");
            joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
            });
        }
    }
}
module.exports.dummyGuilds = dummyGuilds;