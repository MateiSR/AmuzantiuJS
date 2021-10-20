const mongoose = require("mongoose");

const notesSchema = mongoose.Schema({
    // User ID
    _id: {
        type: String,
        required: true
    },
    // Saved notes
    notes: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model("notes", notesSchema);