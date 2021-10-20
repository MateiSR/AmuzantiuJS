const { runCheck } = require("../../utils/decorators.js");
const embeds = require("../../utils/embeds.js");
const queueSchema = require("../../schemas/queue.js");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const mongo = require("../../mongo.js");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Bucharest");

module.exports = {
    name: "savequeue",
    aliases: ["saveq"],
    description: "save queue to `listqueues`",
    async execute(message, args) {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return await message.channel.send({ embeds: [embeds.errorEmbed("Not playing.")] });
        if (runCheck(message)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not connected to the same voice channel.")] });
        if (!player.queue.length) return await message.channel.send({ embeds: [embeds.errorEmbed("Queue is empty.")] });

        await mongo().then(async(mongoose) => {
            try {

                let current = await queueSchema.findOne({ _id: message.author.id });
                if (current !== null) var savedQueues = current["queues"];
                else savedQueues = [];

                if (savedQueues.length > 15) return await message.reply("Maximum of 15 saved queues reached");

                var name;
                if (args.length > 0) name = args.join(" ");
                else name = `${message.author.username}'s Saved Queue #${savedQueues.length + 1}`;

                var tracks = [];
                for (track of player.queue) {
                    tracks.push(track.uri);
                }

                savedQueues.push({ "name": name, "queue": tracks, "totalQueueDuration": player.queue.duration, "dateAdded": dayjs().format("HH:MM on DD/MM/YY") });


                await queueSchema.findOneAndUpdate({
                    _id: message.author.id,
                }, {
                    _id: message.author.id,
                    queues: savedQueues
                }, {
                    upsert: true,
                })
                await message.react("✅");
            } finally {
                mongoose.connection.close();
            }
        })
    }
}