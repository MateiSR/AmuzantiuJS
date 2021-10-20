const queueSchema = require("../../schemas/queue.js");
const mongo = require("../../mongo.js");
const { MessageEmbed } = require("discord.js");
const { parseDuration } = require("../../utils/format.js");

module.exports = {
    name: "removequeue",
    aliases: ["deletequeue", "delq", "removequeue", "removeq"],
    description: "delete specified queue saved using `savequeue`",
    async execute(message, args) {
        await mongo().then(async(mongoose) => {
            try {

                let current = await queueSchema.findOne({ _id: message.author.id });
                var savedQueues = current["queues"];
                if (current === null || savedQueues.length == 0) return await message.reply("No queues saved");
                if (!parseInt(args[0]) || !(savedQueues[parseInt(args[0]) - 1])) return await message.reply("Invalid saved queue.");

                savedQueues.splice(parseInt(args[0]) - 1, 1);

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