const { runCheck } = require("../../utils/decorators.js");
const embeds = require("../../utils/embeds.js");
const radio = require("../../data/radio.json");
const { MessageEmbed } = require("discord.js");
const { globalPrefix } = require("../../command-base.js");

module.exports = {
    name: "radio",
    aliases: ["streams", "playradio", "radiomenu", "playstream"],
    description: "clears queue & plays radio station",
    async execute(message, args) {
        // iterate keys & values of radio streams
        var streamIndex = 0;
        var formattedStreams = [];
        const toSend = new MessageEmbed()
            .setColor("#5865F2")
            .setTitle(`Usage: ${globalPrefix}radio <index>`);

        if (!args[0] || isNaN(args[0])) {
            for (const [name, streamUrl] of Object.entries(radio)) {
                formattedStreams.push(`\`${++streamIndex}\`. ${name} - ${streamUrl}`);
            }

            toSend.setDescription(formattedStreams.join("\n\n"))
            return await message.channel.send({ embeds: [toSend] });
        }
        // check if entry exists in //Object.keys(radio)
        if (Object.keys(radio).length < parseInt(args[0])) return;

        let selectedStream = Object.keys(radio)[parseInt(args[0]) - 1];
        let selectedStreamURI = radio[selectedStream];

        // Abuse prevention checks
        if (runCheck(message))
            return await message.channel.send({
                embeds: [embeds.errorEmbed("Not connected to the same voice channel.")],
            });
        // Create a new player. This will return the player if it already exists.
        const player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,
        });

        player.stream = true;
        await player.queue.clear();
        if (player.paused) player.pause(false);
        if (player.playing) player.stop();
        if (player.state !== "CONNECTED") await player.connect();

        const res = await client.manager.search(selectedStreamURI, message.author);
        let track = res["tracks"][0];
        track.title = selectedStream;
        player.queue.add(track);
        if (!player.playing && !player.paused && !player.queue.size) {
            player.play();
        }
    },
};