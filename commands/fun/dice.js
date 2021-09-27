const random = require("random");
const sharp = require("sharp");
const axios = require("axios");
const { MessageAttachment } = require("discord.js");

sharp.cache(false);

async function getImgStream(url) {
    /* Returns image stream from url */
    return (await axios({ url: url, responseType: "arraybuffer" })).data;
}

async function merge_dices(i1, i2) {
    /* Combine two image streams into one */
    let o = await sharp(i1).png().extend({ right: 48 }).composite([{ input: i2, gravity: "east", position: "right", blend: "over" }]).flatten().toBuffer();
    let att = new MessageAttachment(o, "dice.png");
    return att
}

async function merge_dices_wrap(roll1, roll2) {
    const dice_url = "https://www.random.org/dice/dice"; // ${num}.png
    return (await merge_dices(await getImgStream(`${dice_url}${roll1}.png`), await getImgStream(`${dice_url}${roll2}.png`)));
}

module.exports = {
    name: "dice",
    description: "classic game of dice.",
    async execute(message, args) {
        var rolls = [];
        const names = ["Hugh Jass", "Mike Hawk", "Ben Dover",
            "Dixie Normous", "Barry McKockiner"
        ];
        // gets rolls
        let i = 0;
        while (i < 4) {
            rolls.push(random.int(1, 6));
            i++;
        }
        // calculate sums & merge images
        let p1_sum = rolls[0] + rolls[1];
        let p2_sum = rolls[2] + rolls[3];
        let p1_merged = await merge_dices_wrap(rolls[0], rolls[1]);
        let p2_merged = await merge_dices_wrap(rolls[2], rolls[3]);
        // Send p1 rolls
        await message.channel.send(`**${message.author.username}** rolling.. *(${rolls[0]} ${rolls[1]})*`);
        await message.channel.send({ files: [p1_merged] });
        // Check if player mentioned someone
        var p2_name;
        if (!args[0]) args[0] = `aaa${message.author.id}a`;
        if (args[0]) {
            // get user
            var user = args[0].substring(3, args[0].length - 1);
            user = await client.users.fetch(user);
            // checks
            if (user && !(user.id == message.author.id)) p2_name = user.username;
            else p2_name = names[random.int(0, names.length - 1)];
        };
        let p1_name = message.author.username;
        // Send p2 rolls
        await message.channel.send(`**${p2_name}** rolling.. *(${rolls[2]} ${rolls[3]})*`);
        await message.channel.send({ files: [p2_merged] });
        // Decide winner
        if (p1_sum == p2_sum) return await message.channel.send(`**${p1_name}** and **${p2_name}** tied 😐`);
        if (p1_sum > p2_sum || p1_sum == 2) return await message.channel.send(`**${p1_name}** wins 🥳`);
        if (p2_sum > p1_sum || p2_sum == 2) return await message.channel.send(`**${p2_name}** wins 🥳`);
    }
}