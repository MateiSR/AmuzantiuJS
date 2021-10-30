const { Permissions } = require("discord.js");
const mongo = require('../../mongo.js');
const guildLogsDC = require("../../schemas/guildLogs-dc.js");

client.on("voiceStateUpdate", async(oldVoiceState, newVoiceState) => {
    let newUserChannel = newVoiceState.channel

    if (newUserChannel === null) {
        const target = oldVoiceState.member;
        // Permissions check
        if (!oldVoiceState.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

        // User leaves a voice channel

        const fetchedLogs = await (oldVoiceState, newVoiceState).guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_DISCONNECT',
        });

        const disconnectLog = fetchedLogs.entries.first();
        if (!disconnectLog) return;

        await mongo().then(async(mongoose) => {
            try {
                guildLogs = await guildLogsDC.findOne({ _id: oldVoiceState.guild.id });
                // Run first time setup if it doesn't exist
                if (guildLogs == null) {
                    await guildLogsDC.findOneAndUpdate({
                        _id: oldVoiceState.guild.id,
                    }, {
                        logged: {},
                        received: {},
                        given: {},
                        guildTotal: 0
                    }, {
                        upsert: true,
                    })
                }
                guildLogs = await guildLogsDC.findOne({ _id: oldVoiceState.guild.id });
                logged = guildLogs["logged"];
                if (!guildLogs["received"]) guildLogs["received"] = {};
                if (!guildLogs["given"]) guildLogs["given"] = {};
                // Update logs
                if (!logged || !Object.keys(logged).includes(disconnectLog.id) || logged[disconnectLog.id] < disconnectLog.extra["count"]) {
                    logged[disconnectLog.id] = disconnectLog.extra["count"];

                    if (!guildLogs["received"][target.id]) guildLogs["received"][target.id] = 1;
                    else guildLogs["received"][target.id] += 1;

                    if (!guildLogs["given"][disconnectLog.executor.id]) guildLogs["given"][disconnectLog.executor.id] = 1;
                    else guildLogs["given"][disconnectLog.executor.id] += 1;

                    await guildLogsDC.findOneAndUpdate({
                        _id: oldVoiceState.guild.id,
                    }, {
                        logged: logged,
                        received: guildLogs["received"],
                        given: guildLogs["given"],
                        guildTotal: guildLogs["guildTotal"] + 1
                    }, {
                        upsert: true,
                    })
                }
            } finally {
                mongoose.connection.close();
            }
        })

    }
});