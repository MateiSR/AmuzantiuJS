const { MessageEmbed } = require('discord.js');

module.exports = {
    replyEmbed: function(message) {
        /* Sends an embed with no title and only description */
        const reply = new MessageEmbed()
            .setColor("#5865F2")
            .setTitle("")
            .setDescription(message.toString());
        return reply
    },
    errorEmbed: function(message) {
        /* Sends an embed with no title and only description */
        const reply = new MessageEmbed()
            .setColor("#E74C3C")
            .setTitle("")
            .setDescription(message.toString());
        return reply
    }
}