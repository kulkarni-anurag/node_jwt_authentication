const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blackListSchema = new Schema({
    token: {
        type: String
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '30m' },
    },
})

module.exports = blacklist_model = mongoose.model('blacklist', blackListSchema);