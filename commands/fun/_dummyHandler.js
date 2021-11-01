const { dummyGuilds } = require("./dummy.js");
const { joinVoiceChannel } = require('@discordjs/voice');

client.on("voiceStateUpdate", async(oldVoiceState, newVoiceState) => {
    const target = oldVoiceState.member;
    if (target.id != client.user.id) return;
    if (newVoiceState.channel !== null) return;
    if (!Object.keys(dummyGuilds).includes(oldVoiceState.guild.id)) return;
    const channel = client.channels.cache.get(dummyGuilds[oldVoiceState.guild.id]);
    if (!channel) return delete dummyGuilds[oldVoiceState.guild.id];
    joinVoiceChannel({
        channelId: channel.id,
        guildId: oldVoiceState.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
})