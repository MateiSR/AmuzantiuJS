const { cleanCode } = require("../../utils/format.js")

module.exports = {
    name: "eval",
    description: "runs code and returns output",
    whitelist: ["240781589066285056", "409416925366452225"],
    async execute(message, args) {
        try {
            const code = args.join(" ");
            const evaled = eval(code);
            if (!typeof evaled == "string") evaled = require("util").inspect(evaled);
            let response = cleanCode(evaled);
            await message.channel.send(`\`\`\`xl\n${response.toString()}\n\`\`\``);
            await message.react("✅");
        } catch (err) {
            await message.react("⛔");
            await message.channel.send(`\`\`\`xl\n${cleanCode(err)}\n\`\`\``);
        }
    }
}