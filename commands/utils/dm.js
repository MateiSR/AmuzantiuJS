module.exports = {
    name: "dm",
    aliases: ["pm"],
    description: "(admin) message a user",
    whitelist: ["240781589066285056"],
    async execute(message, args) {
        let mention = message.mentions.users.first();
        mention.send(args.splice(1).join(" "));
    }
}