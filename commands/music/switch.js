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


        if ((parseInt(args[0]) == 0 || parseInt(args[1]) == 0) && !(parseInt(args[0]) == 0 && parseInt(args[1]) == 0)) {
            if (!(parseInt(args[0]) == 0)) {
                aux1 = args[0];
                args[0] = args[1];
                args[1] = aux1;
            }
            // Check if args[1] exists in queue
            if (!player.queue[parseInt(args[1]) - 1]) {
                const errorMsg = await message.reply(`Invalid argument: \`${args[1]}\` [${message.author}]`);
                setTimeout(() => {
                    try {
                        message.delete();
                    } catch {}
                    errorMsg.delete();
                }, 3000);
                return;
            }
            // Push track to queue[-1]
            player.queue.unshift(player.queue[parseInt(args[1]) - 1]);
            // Remove from old position
            player.queue.splice(parseInt(args[1]), 1);
            // Return success message
            return await message.channel.send({ embeds: [embeds.replyEmbed(`Pushed track to front of queue. [${message.author}]`)] });
        }

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