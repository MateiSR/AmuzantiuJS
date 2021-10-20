const queueSchema = require("../../schemas/queue.js");
const mongo = require("../../mongo.js");

module.exports = {
    name: "clearqueue",
    aliases: ["clearqueues", "clearq"],
    description: "clear saved queues",
    async execute(message, args) {
        await mongo().then(async(mongoose) => {
            try {

                let current = await queueSchema.findOne({ _id: message.author.id });
                var savedQueues = current["queues"];
                if (current === null || savedQueues.length == 0) return await message.reply("No queues saved");

                const confirmMessage = await message.reply(`Are you sure you want to delete ${savedQueues.length} saved queues?`);
                const filter = (reaction, user) => ["✅", "❌"].includes(reaction.emoji.name) && !user.bot && user.id == message.author.id;
                for (reaction of["✅", "❌"]) await confirmMessage.react(reaction);
                await confirmMessage.awaitReactions({ filter, max: 1, time: 45000 }).then(async collected => {
                    const reaction = collected.first();
                    if (reaction.emoji.name == "✅") {
                        await queueSchema.findOneAndRemove({
                            _id: message.author.id,
                        })
                        confirmMessage.edit("Cleared saved queues succesfully");
                    } else return await confirmMessage.edit("Succesfully canceled");
                }).catch(async collected => {
                    return await confirmMessage.edit("Succesfully canceled");
                });
                try {
                    confirmMessage.reactions.removeAll();
                } catch {}

            } finally {
                mongoose.connection.close();
            }
        })
    }
}