const guildLogsDC = require("../../schemas/guildLogs-dc.js");
const mongo = require('../../mongo.js');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "logs",
    aliases: ["dclogs", "disconnects"],
    description: "Disconnect logs in the last 24h",
    async execute(message, args) {
        await mongo().then(async(mongoose) => {
            try {
                const toSend = new MessageEmbed()
                    .setColor("#5865F2")
                    .setTitle(`${message.guild.name} - Disconnect logs (24h)`);

                const guildLogs = await guildLogsDC.findOne({ _id: message.guild.id });

                if (guildLogs == null) {
                    toSend.setDescription("No logged data.");
                    return await message.channel.send({ embeds: [toSend] });
                }

                console.log(guildLogs["createdAt"]);

                const desc = [];
                desc.push(`**${guildLogs["guildTotal"]}** total disconnects`);

                desc.push("**Disconnects given**");
                let cnt = 0;


                for (key of Object.keys(guildLogs["given"])) {
                    cnt++;
                    user = client.users.cache.get(key);
                    count = guildLogs["given"][key];
                    desc.push(`**${cnt})** ${user} - ${count} given`);
                }
                desc.push("**Disconnects received**");
                cnt = 0;
                for (key of Object.keys(guildLogs["received"])) {
                    cnt++;
                    user = client.users.cache.get(key);
                    count = guildLogs["received"][key];
                    desc.push(`**${cnt})** ${user} - ${count} received`);
                }

                toSend.setDescription(desc.join("\n"));
                return await message.channel.send({ embeds: [toSend] });
            } finally {
                mongoose.connection.close();
            }
        })

    }
}