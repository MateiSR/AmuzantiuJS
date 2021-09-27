module.exports = {
    name: "spoiler",
    description: "spoiler tags every character in a string",
    async execute(message, args) {
        if (!args.length) return;
        let reply = "";
        for (word of args) {
            for (character of word) reply += `||${character}||`;
            reply += "|| ||";
        }
        await message.channel.send(reply);
    }
}