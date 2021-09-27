const embeds = require("../../utils/embeds.js");
const random = require("random");

module.exports = {
    name: "coinflip",
    aliases: ["coin"],
    description: "flips a coin",
    async execute(message, args) {
        var choices = ["Heads", "Tails"];
        let side = choices[random.int(0, 1)];
        await message.channel.send({ embeds: [embeds.replyEmbed(`You flipped a coin, and it landed on **${side}** [${message.author}]`)] });
    }
}