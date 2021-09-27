const embeds = require("../../utils/embeds.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    description: "shows a list of commands",
    async execute(message, args) {
        const moduleNames = Array.from(client.modules.keys());
        if (!args[0] || !moduleNames.includes(args[0])) {
            const embed = new MessageEmbed().setAuthor(
                    `${client.user.username} - Commands`,
                    client.user.displayAvatarURL()
                )
                .setDescription(moduleNames.join("\n"))
                .setColor("#5865F2")
                .setFooter("a help <module>");
            return await message.channel.send({ embeds: [embed] });
        }

        const embed = new MessageEmbed().setAuthor(
                `${client.user.username} - Commands`,
                client.user.displayAvatarURL()
            )
            .setColor("#5865F2");

        const commandNames = client.modules.get(args[0]);
        for (commandName of commandNames) {
            let command = client.commands.get(commandName);
            embed.addField(commandName, command.description, true)
        }
        return await message.channel.send({ embeds: [embed] });
    }
}