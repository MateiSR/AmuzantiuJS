module.exports = {
    name: "reset",
    aliases: ["restart", "rs"],
    description: "(admin) restarts bot",
    whitelist: ["240781589066285056"],
    async execute(message, args) {
        console.log(">> Client reset called");
        await message.reply("Resetting...");
        await client.destroy();
        await client.login(process.env.TOKEN);
        await message.react("✅");
        console.log(">> Client reset finished succesfully");
    }
}