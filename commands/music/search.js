const embeds = require("../../utils/embeds.js");
const { MessageEmbed } = require("discord.js");
const { runCheck } = require("../../utils/decorators.js");
const { parseDuration } = require("../../utils/format.js");
const { getPlayMessage } = require("../../utils/format.js");
const { globalPrefix } = require("../../command-base.js");


module.exports = {
    name: "search",
    aliases: ["searchplay", "selectplay"],
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
        if (res["loadType"] == "SEARCH_RESULT") {
            var resLength = 5;
            if (res["tracks"].length < 5) resLength = res["tracks"].length;

            player.selectOptions = res["tracks"].slice(resLength - 1);

            const embed = new MessageEmbed().setAuthor(
                    `Choose a song by typing a number (1 - 5):`,
                    client.user.displayAvatarURL()
                )
                .setColor("#5865F2");
            for (let i = 1; i <= resLength; i++) {
                let track = player.selectOptions[i - 1];
                embed.addField(`${i}) ${track.title}`, `by **${track.author}** - ${parseDuration(track.duration)}`);
            }
            embed.setFooter(`React or use ${globalPrefix}select`);

            let searchTCh = message.channel;

            const selectEmbed = await searchTCh.send({ embeds: [embed] });
            player.selectEmbed = selectEmbed;

            selectEmbed
                .react("1️⃣")
                .then(() => selectEmbed.react("2️⃣"))
                .then(() => selectEmbed.react("3️⃣"))
                .then(() => selectEmbed.react("4️⃣"))
                .then(() => selectEmbed.react("5️⃣"));

            const filter = (reaction, user) => {
                return ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            selectEmbed.awaitReactions({ filter, max: 1, time: 60000, errors: ["time"] })
                .then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name == "1️⃣") chosenIndex = 1;
                    else if (reaction.emoji.name == "2️⃣") chosenIndex = 2;
                    else if (reaction.emoji.name == "3️⃣") chosenIndex = 3;
                    else if (reaction.emoji.name == "4️⃣") chosenIndex = 4;
                    else if (reaction.emoji.name == "5️⃣") chosenIndex = 5;

                    if (!res["tracks"][chosenIndex - 1]) {
                        selectEmbed.edit({ embeds: [embeds.errorEmbed("Invalid choice")] });
                        return;
                    };
                    let track = player.selectOptions[chosenIndex - 1];
                    player.queue.add(track);

                    if (!player.playing && !player.paused && !player.queue.size) {
                        player.play();
                    }

                    selectEmbed.edit({ embeds: [getPlayMessage(track, player)] });

                    setTimeout(() => {
                        try {
                            selectEmbed.reactions.removeAll();
                        } catch {}
                    }, 3000);

                    return;
                })
                .catch(collected => {
                    selectEmbed.delete();
                    delete player.selectOptions;
                    delete player.selectEmbed;
                    message.react("⛔");
                })

        } else if (res["loadType"] == "TRACK_LOADED") {
            let track = res["tracks"][0];
            player.queue.add(track);
            await message.channel.send({ embeds: [getPlayMessage(track)] });

            // Plays the player (plays the first track in the queue).
            // The if statement is needed else it will play the current track again
            if (!player.playing && !player.paused && !player.queue.size) {
                player.play();
            }
        } else if (res["loadType"] == "PLAYLIST_LOADED") {
            let tracks = res["tracks"];
            for (track of tracks) {

                // Add all tracks of playlist to queue
                player.queue.add(track);
            }
            await message.channel.send({ embeds: [embeds.replyEmbed(`Queued **${res["playlist"]["name"]}** - ${tracks.length} tracks`)] });
            // For playlists you'll have to use slightly different if statement
            if (!player.playing &&
                !player.paused &&
                player.queue.totalSize === res.tracks.length
            ) {
                player.play();
            }
        } else if (res["loadType"] == "NO_MATCHES") {
            await message.channel.send({ embeds: [embeds.errorEmbed(`No matches found for \`${args.join(" ")}\` [${message.author}]`)] });
        } else if (res["loadType"] == "LOAD_FAILED") {
            await message.channel.send({ embeds: [embeds.errorEmbed(`Failed to load results for \`${args.join(" ")}\` [${message.author}]`)] });
        }

    }
}