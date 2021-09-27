const { MessageEmbed } = require("discord.js");
const { version } = require("../../package.json");

module.exports = {
    name: "info",
    aliases: ["botinfo", "uptime", "up"],
    description: "various stats about bot",
    async execute(message, args) {
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        const embed = new MessageEmbed().setAuthor(
                `${client.user.username} - Bot stats`,
                client.user.displayAvatarURL()
            )
            .addFields({
                name: "Username",
                value: client.user.tag
            }, {
                name: "Version",
                value: `\`${version}\``
            }, {
                name: "Uptime",
                value: `\`${uptime}\``
            }, {
                name: "Prefix",
                value: `\`${prefix}\``
            })
            .setFooter("all rights reserved. Amuzantiu - 2021")
            .setColor("#5865F2");
        await message.channel.send({ embeds: [embed] });
    }
}