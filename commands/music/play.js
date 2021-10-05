const embeds = require("../../utils/embeds.js");
const { Manager } = require("erela.js");
const { runCheck } = require("../../utils/decorators.js");

module.exports = {
    name: "play",
    aliases: ["p"],
    description: "queues a track or playlist",
    async execute(message, args) {
        if (runCheck(message)) return await message.channel.send({ embeds: [embeds.errorEmbed("Not connected to the same voice channel.")] });
        if (!args[0]) return;
        // Retrieves tracks with your query and the requester of the tracks.
        // Note: This retrieves tracks from youtube by default, to get from other sources you must enable them in application.yml and provide a link for the source.
        // Note: If you want to "search" for tracks you must provide an object with a "query" property being the query to use, and "source" being one of "youtube", "soundcloud".
        const res = await client.manager.search(
            args.join(" "),
            message.author
        );

        // Create a new player. This will return the player if it already exists.
        const player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,
        });

        // Connect to the voice channel.
        if (player.state !== "CONNECTED") await player.connect();

        // Stream check
        if (player.stream) {
            player.stream = false;
            player.setTrackRepeat(false);
            player.stop();
        }

        /*
        # Valid loadTypes are:
        #   TRACK_LOADED    - single video/direct URL)
        #   PLAYLIST_LOADED - direct URL to playlist)
        #   SEARCH_RESULT   - query prefixed with either ytsearch: or scsearch:.
        #   NO_MATCHES      - query yielded no results
        #   LOAD_FAILED     - most likely, the video encountered an exception during loading.
        */
        if (res["loadType"] == "PLAYLIST_LOADED") {
            let tracks = res["tracks"];
            for (track of tracks) {
                // Add all tracks of playlist to queue
                player.queue.add(track);
            }
            await message.channel.send({ embeds: [embeds.replyEmbed(`Queued **${res["playlist"]["name"]}** - ${tracks.length} tracks`)] });
        } else {
            let track = res["tracks"][0];
            player.queue.add(track);
            await message.channel.send({ embeds: [embeds.replyEmbed(`Queued [${track.title}](${track.uri}) [${message.author}]`)] });
        }

        // Debug // console.log(`Playing: ${player.playing}\nPaused: ${player.paused}\nQueue size: ${player.queue.size}\nQueue total size: ${player.queue.totalSize}\n`);
        // Plays the player (plays the first track in the queue).
        // The if statement is needed else it will play the current track again
        if (!player.playing && !player.paused && !player.queue.size) {
            player.play();
        }

        // For playlists you'll have to use slightly different if statement
        if (!player.playing &&
            !player.paused &&
            player.queue.totalSize === res.tracks.length
        ) {
            player.play();
        }
    }
}