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

async function startSort(result, message, search, targetChannel) {
    for (post of result["posts"]["post"]) {
        post = post["$"];
        let postTags = post["tags"].toString().replaceAll("_", "\\_");
        let imgEmbed = new MessageEmbed()
            .setColor("#ffb3a7")
            .setTitle(search)
            .setDescription(postTags)
            .setImage(url = post["file_url"])
            .setFooter(`ID ${post["id"]}`);
        let sortEmbed = await message.channel.send({ embeds: [imgEmbed] });
        const filter = (reaction, user) => ["✅", "❌", "⛔"].includes(reaction.emoji.name) && !user.bot && user.id == message.author.id;
        for (react of["✅", "❌", "⛔"]) await sortEmbed.react(react);
        let funcRes = await sortEmbed.awaitReactions({ filter, max: 1, time: 45000 }).then(collected => {
            const reaction = collected.first();
            if (!reaction || reaction.length == 0) return message.channel.send({ embeds: [embeds.errorEmbed(`Timed out after 45 seconds [${message.author}]`)] });
            if (reaction.emoji.name == "✅") targetChannel.send({ embeds: [imgEmbed] });
            else if (reaction.emoji.name == "❌") return true;
            else if (reaction.emoji.name == "⛔") return false;
            else return;
        });
        if (funcRes == false) break;
    }
}

module.exports = {
    name: "rule34sort",
    aliases: ["r34sort", "sort"],
    description: "r34 sorting",
    async execute(message, args) {
        // sort <target_channel> <page_id> <search>
        if (args.length < 3) return await message.channel.send({ embeds: [embeds.errorEmbed(`Command syntax: \`${prefix}sort <target channel> <rule34 page> <rule34 search>\``)] });
        let targetChannel = client.channels.cache.get(args[0].slice(2, args[0].length - 1));
        if (targetChannel == undefined) return;
        if (!message.channel.nsfw || !targetChannel.nsfw) return await message.channel.send({ embeds: [embeds.errorEmbed(`Both origin and target channel need to be NSFW [${message.author}]`)] });
        let search = args.splice(2, args.length - 1);
        let searchString = search.join(" ");
        let res = await rule34Search(search);
        if (res == undefined || !res["posts"]["post"]) return await message.channel.send({ embeds: [embeds.errorEmbed(`No results found for \`${searchString}\` [${message.author}]`)] });
        //let postTags = chosenPost["tags"].toString().replaceAll("_", "\\_");
        let postCount = res["posts"]["post"].length;
        const confirmMessage = await message.channel.send({ embeds: [embeds.replyEmbed(`Start sorting by term(s) \`${search}\` in channel ${targetChannel}? [${message.author}]`).addField(`${postCount} results found`, value = ":white_check_mark: to add | :x: to skip | :no_entry: to stop")] });
        const filter = (reaction, user) => ["✅", "❌", "⛔"].includes(reaction.emoji.name) && !user.bot && user.id == message.author.id;
        for (react of["✅", "❌", "⛔"]) confirmMessage.react(react);
        confirmMessage.awaitReactions({ filter, max: 1, time: 45000 }).then(collected => {
            const reaction = collected.first();
            if (reaction.emoji.name == "✅") startSort(res, message, searchString, targetChannel);
            else return;
        });
    }
}