const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_SRV).then(() => console.log(">> Connected to MongoDB"))
    .catch(() => console.log(">> Couldn't connect to MongoDB"))