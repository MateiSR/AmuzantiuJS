const axios = require("axios");

module.exports = {
    name: "reset",
    aliases: ["restart", "rs"],
    description: "(admin) restarts bot via Heroku API",
    whitelist: ["240781589066285056"],
    async execute(message, args) {
        message.reply("Resetting...");
        axios.delete("https://api.heroku.com/apps/mateisr-js/dynos/worker", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/vnd.heroku+json; version=3",
                "Authorization": `Bearer ${process.env.HEROKU_AUTH}`
            }
        })
    }
}