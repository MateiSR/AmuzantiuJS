const getArtistTitle = require('get-artist-title');

client.once("ready", async() => { // wait until client is ready
    client.manager.on("trackStart", async(player, track) => {
        if (player.copycat) {
            let result = getArtistTitle(track.title);
            if (result) [artist, title] = result;
            else artist = track.title;
            // set bot nickname to "artist"
            try {
            let guild = client.guilds.cache.get(player.guild);
            guild.members.fetch(client.user.id).then(async member => { member.setNickname(artist.slice(0, 31)); });
            } catch (err) {
                player.copycat = false;
            }
        }
    })
    .on("queueEnd", async(player) => {
        if (player.copycat) {
            try {
                let guild = client.guilds.cache.get(player.guild);
                guild.members.fetch(client.user.id).then(async member => { member.setNickname(artist.slice(0, 31)); });
            } catch (err) {
                player.copycat = false;
            }
        }
    })
    .on("playerMove", async(player, oldChannel, newChannel) => {
        // Note: newChannel will always be a string, if you pass the channel object you will need to get the cached channel.
        if (newChannel == null && oldChannel !== null) {
            if (player.copycat) {
                try {
                    let guild = client.guilds.cache.get(player.guild);
                    guild.members.fetch(client.user.id).then(async member => { member.setNickname(artist.slice(0, 31)); });
                } catch (err) {}
            }
            player.destroy();
        }
    });
});