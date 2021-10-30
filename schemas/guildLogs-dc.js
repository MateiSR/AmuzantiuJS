const mongoose = require("mongoose");

const guildLogsDC = mongoose.Schema({
    // Guild ID
    _id: {
        type: String,
        required: true
    },
    // Logged IDs // sets expiry after 1h
    logged: {
        type: Object,
        default: {},
        required: true
    },
    // Number of disconnects received
    received: {
        type: Object,
        default: {},
        required: true
    },
    // Number of disconnects given
    given: {
        type: Object,
        default: {},
        required: true
    },
    // No of total dcs in guild
    guildTotal: {
        type: Number,
        default: 0,
        required: true
    },
    createdAt: { type: Date, expires: 86400, default: Date.now }
})

module.exports = mongoose.model("guildLogs-dc", guildLogsDC);