const embeds = require("../../utils/embeds.js");
const { Permissions } = require('discord.js');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "roleall",
    permissions: [Permissions.FLAGS.MANAGE_ROLES],
    description: "gives role to all members in current guild",
    async execute(message, args) {
        let role = message.mentions.roles.first();
        if (!role) {
            message.react("❌");
            return;
        }
        let toSend = new MessageEmbed()
        .setColor("#5865F2")
        .setTitle("Confirmation")
        .setDescription(`Are you sure you want to give role **${role.name}** to **ALL** members in **${message.guild.name}**?`);
        let confirmEmbed = await message.reply({ embeds: [toSend] });
        const filter = (reaction, user) => ["✅", "❌"].includes(reaction.emoji.name) && !user.bot && user.id == message.author.id;
        for (react of["✅", "❌"]) await confirmEmbed.react(react);
        let funcRes = await confirmEmbed.awaitReactions({ filter, max: 1, time: 15000 }).then(collected => {
            const reaction = collected.first();
            if (!reaction || reaction.length == 0) return message.reply({ embeds: [embeds.errorEmbed(`Action timed out [${message.author}]`)] });
            if (reaction.emoji.name == "✅") return true;
            else if (reaction.emoji.name == "❌") return message.reply({ embeds: [embeds.errorEmbed(`Action cancelled [${message.author}]`)] });
        }).catch((collected) => {
            return message.reply({ embeds: [embeds.errorEmbed(`Action timed out [${message.author}]`)] });
        });
        if (funcRes) {
            var cnt = 0;
            message.guild.members.cache.filter(m => !m.user.bot).forEach(member => {
                member.addRole(role);
                cnt++;
            });
            confirmEmbed.delete();
            return message.reply({embeds:[embeds.replyEmbed(`Succesfully gave role **${role.name}** to **${cnt}** members in **${message.guild.name}** [${message.author}]`)]});
        }
    }
}