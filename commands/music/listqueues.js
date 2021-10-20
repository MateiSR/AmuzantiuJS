const queueSchema = require("../../schemas/queue.js");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const mongo = require("../../mongo.js");
const { MessageEmbed } = require("discord.js");
const { parseDuration } = require("../../utils/format.js");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Bucharest");

module.exports = {
    name: "listqueues",
    aliases: ["listq", "listqueue"],
    description: "list queues saved using `savequeue`",
    async execute(message, args) {
        await mongo().then(async(mongoose) => {
            try {

                let current = await queueSchema.findOne({ _id: message.author.id });
                var savedQueues = current["queues"];
                if (current === null || savedQueues.length == 0) return await message.reply("No queues saved");

                for (i = 0; i < savedQueues.length; i++) {
                    let tracks = savedQueues[i].queue.length;
                    let parsedDuration = parseDuration(savedQueues[i].totalQueueDuration);
                    savedQueues[i] = `\`${i + 1}.\` **${savedQueues[i].name}** - **${tracks}** track(s)\n**${parsedDuration}** total duration | Added at \`${savedQueues[i].dateAdded}\``;
                }

                const toSend = new MessageEmbed()
                    .setTitle(`${message.author.username}'s saved queues`)
                    .setColor("#6699cc")
                    .setDescription(savedQueues.join("\n"));

                await message.channel.send({ embeds: [toSend] });

            } finally {
                mongoose.connection.close();
            }
        })
    }
}