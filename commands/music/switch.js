const embeds = require("../../utils/embeds.js");
const { runCheck } = require("../../utils/decorators.js");

module.exports = {
    name: "switch",
    aliases: ["swap"],
    description: "switches the position of two songs in queue",
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player || (!player.playing && player.queue.size == 0)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        if (runCheck(message)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not connected to the same voice channel.")] });

        if (!player.queue[parseInt(args[0]) - 1] || !player.queue[parseInt(args[1]) - 1]) {
            const errorMsg = await message.reply(`Invalid arguments [${message.author}]`);
            setTimeout(() => {
                try {
                    message.delete();
                } catch {}
                errorMsg.delete();
            }, 3000);
            return;
        }

        var aux = player.queue[parseInt(args[0]) - 1];
        player.queue[parseInt(args[0]) - 1] = player.queue[parseInt(args[1]) - 1];
        player.queue[parseInt(args[1]) - 1] = aux;

        return await message.react("✅");
    }
}