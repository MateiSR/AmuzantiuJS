const axios = require("axios");
const { parseString } = require("xml2js");
const random = require("random");
const embeds = require("../../utils/embeds.js");
const { MessageEmbed } = require("discord.js");

async function rule34Search(args, pageId = 0) {
    let search = args.join("+");
    let reqData = (await axios.get(`https://rule34.xxx//index.php?page=dapi&s=post&q=index&tags=${search}&pid=${pageId}`)).data;
    const result = await new Promise((resolve, reject) => parseString(reqData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    }));
    return result;
}

module.exports = {
    name: "rule34search",
    aliases: ["rule34", "r34", "r34s"],
    description: "return random post with tag on r34",
    async execute(message, args) {
        if (!message.channel.nsfw) return await message.channel.send({ embeds: [embeds.errorEmbed(`Can only be used in NSFW channels [${message.author}]`)] });
        let res = await rule34Search(args);
        let postCount = res["posts"]["post"].length;
        let argsString = args.join(" ");
        if (postCount == 0) return await message.channel.send({ embeds: [embeds.errorEmbed(`No results found for \`${argsString}\` [${message.author}]`)] });
        let chosenPost = res["posts"]["post"][random.int(0, postCount - 1)]["$"];
        let postTags = chosenPost["tags"].toString().replaceAll("_", "\\_");
        let imgEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(argsString)
            .setDescription(postTags)
            .setImage(url = chosenPost["file_url"])
            .setFooter(`ID ${chosenPost["id"]}`);
        await message.channel.send({ embeds: [imgEmbed] });
    }
}