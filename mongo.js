const mongoose = require("mongoose");

module.exports = async() => {
    await mongoose.connect(process.env.MONGODB_SRV_DEV, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    return mongoose
}