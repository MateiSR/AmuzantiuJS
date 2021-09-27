const { TrackUtils } = require("erela.js");
const embeds = require("./embeds.js");

module.exports = {
    // check if is playing & not paused
    voiceCheck: async function(message) {
        const player = client.manager.players.get(message.guild.id);
        if (!player.playing && !player.paused) return false;
        return true;
    },
    // not connected to the same vc check
    runCheck: function(message) {
        const player = client.manager.players.get(message.guild.id);
        if (!message.member.voice.channel) return true;
        if (!player) return false;
        if (player.voiceChannel != message.member.voice.channel.id) return true;
    }
}