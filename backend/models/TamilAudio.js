const mongoose = require('mongoose')

const Tamil = mongoose.Schema({
    url: {
        type:String,
        required: true
    }
})


module.exports = mongoose.model('TamilVideo', Tamil)