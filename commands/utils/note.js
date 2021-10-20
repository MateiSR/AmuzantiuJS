const embeds = require("../../utils/embeds.js");
const mongo = require('../../mongo.js');
const notesSchema = require("../../schemas/notes.js");
const { MessageEmbed } = require("discord.js");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Bucharest");


module.exports = {
    name: "note",
    aliases: ["notes", "saved"],
    description: "",
    async execute(message, args) {
        const validChoices = ["add", "delete", "list", "clear"];
        if (!args[0] || !(validChoices.includes(args[0]))) return await message.reply({ embeds: [embeds.replyEmbed(`Valid arguments:\n${validChoices.join(", ")}`)] });
        if (args.join(" ").length > 120) return await message.reply("Maximum note length is 120 characters.")
        await mongo().then(async(mongoose) => {
            try {

                let current = await notesSchema.findOne({ _id: message.author.id });
                if (current !== null) var savedNotes = current["notes"];
                else savedNotes = [];
                if (savedNotes.length > 15) return await message.reply("You have reached your note limit (15). Delete one to add more.")

                switch (args[0]) {
                    case "add":
                        savedNotes.push({ "content": args.splice(1, args.length - 1).join(" "), "dateAdded": dayjs().format("HH:MM on DD/MM/YY") });

                        await notesSchema.findOneAndUpdate({
                            _id: message.author.id,
                        }, {
                            _id: message.author.id,
                            notes: savedNotes
                        }, {
                            upsert: true,
                        })
                        await message.react("✅");
                        break;
                    case "delete":
                        if (current === null || savedNotes.length == 0) return await message.reply("No notes have been created thus far.");
                        if (!parseInt(args[1]) || !(savedNotes[parseInt(args[1]) - 1])) return await message.reply("Invalid note number.");

                        savedNotes.splice(parseInt(args[1]) - 1, 1);

                        await notesSchema.findOneAndUpdate({
                            _id: message.author.id,
                        }, {
                            _id: message.author.id,
                            notes: savedNotes
                        }, {
                            upsert: true,
                        })
                        await message.react("✅");

                        break;
                    case "list":
                        if (current === null || savedNotes.length == 0) return await message.reply("No notes have been created thus far.");

                        for (i = 0; i < savedNotes.length; i++) {
                            savedNotes[i] = `\`${i + 1}.\` ${savedNotes[i].content}\nAdded at \`${savedNotes[i].dateAdded}\``
                        }

                        const toSend = new MessageEmbed()
                            .setTitle(`${message.author.username}'s saved notes`)
                            .setColor("#90ee90")
                            .setDescription(savedNotes.join("\n"));
                        await message.channel.send({ embeds: [toSend] });
                        break;
                    case "clear":
                        if (current === null || savedNotes.length == 0) return await message.reply("No notes have been created thus far.");
                        const confirmMessage = await message.reply(`Are you sure you want to delete ${savedNotes.length} notes?`);
                        const filter = (reaction, user) => ["✅", "❌"].includes(reaction.emoji.name) && !user.bot && user.id == message.author.id;
                        for (reaction of["✅", "❌"]) await confirmMessage.react(reaction);
                        await confirmMessage.awaitReactions({ filter, max: 1, time: 45000 }).then(async collected => {
                            const reaction = collected.first();
                            if (reaction.emoji.name == "✅") {
                                await notesSchema.findOneAndRemove({
                                    _id: message.author.id,
                                })
                                confirmMessage.edit("Cleared notes succesfully");
                            } else return await confirmMessage.edit("Succesfully canceled");
                        }).catch(async collected => {
                            return await confirmMessage.edit("Succesfully canceled");
                        });
                        try {
                            confirmMessage.reactions.removeAll();
                        } catch {}
                        break;
                }
            } finally {
                mongoose.connection.close();
            }
        })
    }
}