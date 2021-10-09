const embeds = require("../../utils/embeds.js");
const random = require("random");

module.exports = {
    name: "8ball",
    description: "8ball. that's it",
    async execute(message, args) {
        var options = ["it is certain", "looking good", "outlook good", "you may rely on it",
            "ask again later", "concentrate and ask again", "my reply is no", "my sources say no"
        ];
        let randomChoice = options[random.int(0, options.length - 1)];
        await message.channel.send({ embeds: [embeds.replyEmbed(`:8ball:  ${randomChoice}`)] })
    }
}