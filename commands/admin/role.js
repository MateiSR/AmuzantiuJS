const { Permissions } = require('discord.js');
const embeds = require("../../utils/embeds.js");
module.exports = {
    name: "role",
    description: "gives role to mentioned user",
    permissions: [Permissions.FLAGS.MANAGE_ROLES],
    async execute(message, args) {
        let user = message.mentions.users.first();
        let role = message.mentions.roles.first();
        if (!user || !role) {
            message.react("❌");
            return;
        }
        message.guild.members.fetch(user.id).then(member => {
            member.roles.add(role);
        })
        message.react("✅");
    }
}