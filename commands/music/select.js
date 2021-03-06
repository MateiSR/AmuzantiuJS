const embeds = require('../../utils/embeds.js');
const { getPlayMessage } = require("../../utils/format.js");

module.exports = {
    name: "select",
    aliases: ["sel"],
    description: "follow-up to `search` command",
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player || !player.selectOptions) return;
        if (Number.isFinite(args[0])) {
            if (parseInt(args[0]) >= 1 && parseInt(args[0]) <= player.selectOptions.length) return message.react("⛔");
        }

        let track = player.selectOptions[parseInt(args[0]) - 1];
        player.queue.add(track);

        if (!player.playing && !player.paused && !player.queue.size) {
            player.play();
        }

        player.selectEmbed.edit({ embeds: [getPlayMessage(track, player)] });

        setTimeout(() => {
            try {
                player.selectEmbed.reactions.removeAll();
            } catch {}
        }, 3000);

        delete player.selectOptions;
        delete player.selectEmbed;
    }
}