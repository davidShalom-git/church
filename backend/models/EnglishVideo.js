const mongoose = require('mongoose')

const English = mongoose.Schema({
    url: {
        type:String,
        required: true
    }
})


module.exports = mongoose.model('EnglishVideo', English)