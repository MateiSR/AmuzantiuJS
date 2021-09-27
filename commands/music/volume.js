const embeds = require("../../utils/embeds.js");
const { runCheck } = require("../../utils/decorators.js");

module.exports = {
    name: "volume",
    aliases: ["setvol", "v"],
    description: "changes volume",
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player || (!player.playing && player.queue.size == 0)) return;
        if (runCheck(message)) return;
        let parsedVolume = parseInt(args[0]);
        if (parsedVolume == NaN || !parsedVolume) return;
        if (parsedVolume < 0 || parsedVolume > 1000) return await message.channel.send({ embeds: [embeds.errorEmbed("Invalid value `(1-1000 required)`")] });
        player.setVolume(parsedVolume);
        await message.channel.send({ embeds: [embeds.replyEmbed(`Set the volume to ${parsedVolume} [${message.author}]`)] });
    }
}