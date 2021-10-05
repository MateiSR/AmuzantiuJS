module.exports = {
    name: "carousel",
    description: "moves you. fast.",
    cooldown: 60000,
    aliases: ["fastmove"],
    async execute(message, args) {
        let i = 0;
        let currentChannel = message.member.voice.channel.id;
        for (channel of message.guild.channels.cache) {
            let channelId = channel[0];
            if (!(channel[1].type == "GUILD_VOICE")) continue;
            await message.member.voice.setChannel(channelId);
            // ratelimit
            if (++i == 9) break;
        }
        await message.member.voice.setChannel(currentChannel);
        await message.react("✅");
    }
}