const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const filter = require("erela.js-filters");
const embeds = require("../../utils/embeds.js");
const { parseDuration } = require("../../utils/format.js");

const clientID = "e4e458d354a84af5874759ef25eb65d6";
const clientSecret = "4f678aa53cbd428a88b4600a9cc14429";

/* Nodes
{
    host: "lava.link",
    port: 80,
    password: "1234",
    identifier: "lava-dot-link"
    },
    {
    host: "64.112.126.84",
    port: 2333,
    password: "ysnp123",
    identifier: "self-hosted-1"
    }
*/

// Initiate the music (erela.js) Manager with some options and listen to some events.
client.manager = new Manager({
        // Pass an array of node. Note: You do not need to pass any if you are using the default values (ones shown below).
        nodes: [{
            host: "lava.link",
            port: 80,
            password: "1234",
            identifier: "lava-dot-link"
        }],
        plugins: [ // Initiate the plugin and pass the two required options.
            new Spotify({
                clientID,
                clientSecret
            }),
            new filter()
        ],
        // A send method to send data to the Discord WebSocket using your library.
        // Getting the shard for the guild and sending the data to the WebSocket.
        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        },
    })
    .on("nodeConnect", node => console.log(`> Music: Node ${node.options.identifier} connected`))
    .on("nodeError", (node, error) => console.log(`> Music: Node ${node.options.identifier} had an error: ${error.message}`))
    .on("trackStart", (player, track) => {
        // player.currentTrack is to avoid repeating song loop & live play messages
        clearTimeout(player.timeoutID);
        player.timeoutID = undefined;
        if (player.currentTrack == track) return;
        let parsedDuration = parseDuration(track.duration);
        client.channels.cache
            .get(player.textChannel)
            //.send(`Now playing: ${track.title}`);
            .send({ embeds: [embeds.replyEmbed(`Playing [${track.title}](${track.uri}) - ${parsedDuration} [${track.requester}]`)] });
        player.currentTrack = track;
    })
    .on("trackEnd", (player, track) => {
        player.currentTrack = undefined;
        player.setQueueRepeat(false);
        player.setTrackRepeat(false);
    })
    .on("queueEnd", (player) => {
        /*
        client.channels.cache
            .get(player.textChannel)
            .send("Queue has ended.");
        player.destroy();
        */
        player.timeoutID = undefined;
        player.timeoutID = setTimeout(() => {
            client.channels.cache
                .get(player.textChannel)
                .send({ embeds: [embeds.replyEmbed("Left voice channel after no activity for `10 minutes`.")] });
            player.destroy();
        }, 10 * 60 * 1000);
    })
    .on("playerMove", (player, oldChannel, newChannel) => {
        // Note: newChannel will always be a string, if you pass the channel object you will need to get the cached channel.
        if (newChannel == null && oldChannel !== null) player.destroy();
        player.voiceChannel = newChannel;
        setTimeout(function() {
            player.pause(false);
        }, 3000);
    });

// Initiate the music manager.
client.once("ready", async() => {
    client.manager.init(client.user.id);
});

// Here we send voice data to lavalink whenever the bot joins a voice channel to play audio in the channel.
client.on("raw", (d) => client.manager.updateVoiceState(d));