const embeds = require("../../utils/embeds.js");
const { runCheck } = require("../../utils/decorators.js");

module.exports = {
    name: "disconnect",
    aliases: ["dc", "leave"],
    description: "leaves channel and clears queue",
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        if (runCheck(message)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not connected to the same voice channel.")] });
        //await message.react("⛔");
        let vcName = await client.channels.cache.get(player.voiceChannel).name;
        await message.channel.send({ embeds: [embeds.replyEmbed(`Left channel \`${vcName}\` [${message.author}]`)] });
        await player.destroy();
    }
}