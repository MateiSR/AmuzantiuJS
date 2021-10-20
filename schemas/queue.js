const mongoose = require("mongoose");

const queueSchema = mongoose.Schema({
    // User ID
    _id: {
        type: String,
        required: true
    },
    // Saved notes
    queues: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model("user-queues", queueSchema);