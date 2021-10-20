const mongo = require("../../mongo.js");
const queueSchema = require("../../schemas/queue.js");
const { MessageEmbed } = require("discord.js");
const { parseDuration } = require("../../utils/format.js");
const { runCheck } = require("../../utils/decorators.js");
const embeds = require("../../utils/embeds.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "playqueue",
    description: "plays a queue `listqueues`",
    aliases: ["playq", "playsaved"],
    async execute(message, args) {
        // Create a new player. This will return the player if it already exists.
        const player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,
        });

        // Connect to the voice channel.
        if (player.state !== "CONNECTED") await player.connect();

        await mongo().then(async(mongoose) => {
            try {

                let current = await queueSchema.findOne({ _id: message.author.id });
                var savedQueues = current["queues"];
                if (current === null || savedQueues.length == 0) return await message.reply("No queues saved");
                if (!parseInt(args[0]) || !(savedQueues[parseInt(args[0]) - 1])) return await message.reply("Invalid saved queue.");

                if (player.paused) player.pause = false;
                if (player.playing) player.stop();
                player.queue.clear();

                let q = savedQueues[parseInt(args[0]) - 1];

                for (trackURI of q.queue) {
                    let res = await client.manager.search(
                        trackURI,
                        message.author
                    );
                    player.queue.add(res["tracks"][0]);
                    if (!player.playing) player.play();
                }

                await message.channel.send({ embeds: [embeds.replyEmbed(`Playing **${q.name}** - ${q.queue.length} tracks\nTotal duration: ${parseDuration(q.totalQueueDuration)}`)] })


            } finally {
                mongoose.connection.close();
            }
        })
    }
}