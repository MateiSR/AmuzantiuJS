const { MessageEmbed } = require("discord.js");

module.exports = {
    cleanCode: function(text) {
        if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    },
    parseDuration: function(millis) {
        /*
        var d = new Date(1000 * Math.round(ms / 1000)); // round to nearest second
        function pad(i) { return ('0' + i).slice(-2); }
        var str = d.getUTCHours() + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds());
        return str;
        */

        // check if live
        if (millis == 9223372036854776000) return "LIVE";
        // format ms
        let sec = Math.floor(millis / 1000);
        let hrs = Math.floor(sec / 3600);
        sec -= hrs * 3600;
        let min = Math.floor(sec / 60);
        sec -= min * 60;

        sec = '' + sec;
        sec = ('00' + sec).substring(sec.length);

        if (hrs > 0) {
            min = '' + min;
            min = ('00' + min).substring(min.length);
            return hrs + ":" + min + ":" + sec;
        } else {
            return min + ":" + sec;
        }
    },
    chunkArray: function(myArray, chunk_size) {
        var index = 0;
        var arrayLength = myArray.length;
        var tempArray = [];

        for (index = 0; index < arrayLength; index += chunk_size) {
            myChunk = myArray.slice(index, index + chunk_size);
            // Do something if you want with the group
            tempArray.push(myChunk);
        }

        return tempArray;
    },
    parseDurationStr: function(str) {
        var time = str.split(":");
        while (time.length < 4) time.splice(0, 0, 0);
        let ret = parseInt(time[0]) * 60 * 60 * 24 + parseInt(time[1]) * 60 * 60 + parseInt(time[2]) * 60 + parseInt(time[3]);
        return ret;
    },

    getPlayMessage: function(track, player) {

        const { parseDuration } = require("./format.js");
        const playMessage = new MessageEmbed()
            .setTitle("🎵   Added to queue")
            .setColor("#5865F2")
            .setThumbnail(track.thumbnail)
            .setDescription(`[${track.title}](${track.uri})`)
            .addField("Channel", track.author, true)
            .addField("Song Duration", parseDuration(track.duration), true)
            .addField("Requested by", `${track.requester}`, true);

        if (player.queue.size == 0) playMessage.addField("Position in queue", "Playing now");
        else {
            playMessage.addField("Position in queue", player.queue.size.toString(), true);
            if (player.queue.current.duration == 9223372036854776000) playMessage.addField("ETA until playing", "Skipping stream, playing now", true);
            else if (track.duration == 9223372036854776000) playMessage.addField("ETA until playing", "Playing now", true);
            else playMessage.addField("ETA until playing", parseDuration(player.queue.duration - player.position - track.duration), true);
        }

        return playMessage;
    }
}