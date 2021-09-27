const embeds = require("../../utils/embeds.js");
const { Manager } = require("erela.js");
const { voiceCheck, runCheck } = require("../../utils/decorators.js");

module.exports = {
    name: "skip",
    aliases: ["n", "next", "s"],
    description: "skips current track",
    async execute(message, args) {
        if (!await voiceCheck(message)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        const player = client.manager.players.get(message.guild.id);
        if (runCheck(message)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not connected to the same voice channel.")] });
        //if (!player.playing && !player.paused) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        player.setTrackRepeat(false);
        player.stop();
        await message.react("⏩");
    }
}